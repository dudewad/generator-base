import { Injectable } from '@angular/core';

interface EcwidWindow extends Window {
  Ecwid: {
    destroy: () => void;
    openPage: (
      pageName: string,
      opts?: { id: number },
    ) => void;
  }
  xProductBrowser: (...attrs) => void;
}

@Injectable({ providedIn: 'root' })
export class EcwidSvc {
  private container: HTMLDivElement;
  private hasInitted = false;
  private hasLoaded = false;
  private parentEl: HTMLElement;
  private storeId: string;

  public init(parentEl: HTMLElement) {
    let container: HTMLDivElement = this.container;

    if (!this.container) {
      container = document.createElement('div');
      container.id = `ecwid-store-${this.storeId}`;
      this.container = container;
    }

    this.parentEl = parentEl;
    this.parentEl.appendChild(container);
    this.initStore();
  }

  public load(storeId: string) {
    this.storeId = storeId;

    if (!this.hasLoaded) {
      const script = document.createElement('script');

      script.setAttribute('type', 'text/javascript');
      script.setAttribute('charset', 'utf-8');
      script.setAttribute('data-cfasync', 'false');
      script.setAttribute('src', `https://app.ecwid.com/script.js?${storeId}&data_platform=code&data_date=2020-02-17`);
      script.onload = () => {
        this.hasLoaded = true;
        this.initStore();
      };
      window.setTimeout(() => {
        document.querySelector('body').appendChild(script);
      });
    }
  }

  public reset() {
    this.parentEl = undefined;
  }

  private initStore() {
    if (!this.parentEl || !this.hasLoaded || this.hasInitted) {
      return;
    }

    (window as EcwidWindow).xProductBrowser(
      'categoriesPerRow=3',
      'views=grid(20,3) list(60) table(60)',
      'categoryView=grid',
      'searchView=list',
      `id=ecwid-store-${this.storeId}`,
    );

    this.hasInitted = true;
  }
}
