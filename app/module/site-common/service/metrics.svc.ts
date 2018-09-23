import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

export const MetricTypes: any = {
  google: 'google'
};

const MetricScriptUrls: any = {
  google: 'https://www.google-analytics.com/analytics.js'
};

@Injectable()
export class Metrics_Svc {
  private metricsConfigs: any;
  private metricsFired: any;
  private metricsInstances: any = {};
  private routerEventSub: Subscription;

  constructor(private router: Router) {
    if (ENV !== 'production' && ENV !== 'prod') {
      console.log('Metrics are disabled when not in production mode.');
      return;
    }

    this.routerEventSub = this.router.events
      .pipe(filter(evt => evt instanceof NavigationEnd))
      .subscribe(evt => {
        this.onNavigationEnd(evt);
      });
  }

  init(metrics) {
    if (ENV !== 'production' && ENV !== 'prod') {
      return;
    }

    this.metricsConfigs = metrics;
    this.initMetrics();
  }

  private onNavigationEnd(evt: any) {
    let instances = this.metricsInstances;

    this.metricsFired = {};

    for (let type in instances) {
      if (instances.hasOwnProperty(type)) {
        this.firePageLoad(type);
      }
    }
  }

  private firePageLoad(type: string) {
    if (!this.metricsFired || this.metricsFired[type]) {
      return;
    }

    let instances = this.metricsInstances;
    this.metricsFired[type] = true;

    switch (type) {
      case MetricTypes.google:
        let ga = instances[type];
        ga('set', 'pageview', this.router.routerState.snapshot.url);
        ga('send', 'pageview');
        break;
    }
  }

  private initMetrics() {
    let instances = this.metricsInstances;
    let cfgs = this.metricsConfigs;

    for (let cfg in cfgs) {
      if (cfgs.hasOwnProperty(cfg) && !instances[cfg]) {
        switch (cfg) {
          case MetricTypes.google:
            this.loadGoogleAnalytics();
            break;
        }
      }
    }
  }

  private loadGoogleAnalytics() {
    let cb = this.onGoogleLoad.bind(this);
    (function (i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * <any>(new Date());
      a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      a.onload = cb;
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', MetricScriptUrls.google, 'ga');
  }

  private onGoogleLoad() {
    this.metricsInstances[MetricTypes.google] = ga;
    ga('create', this.metricsConfigs.google.trackingId, 'auto');
    this.firePageLoad(MetricTypes.google);
  }
}