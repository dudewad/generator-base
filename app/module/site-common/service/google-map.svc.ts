import { Inject, Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

import { Config_Svc, ConfigTypes } from './config.svc';
import { Asset_Svc } from './asset.svc';
import { GlobalEvent_Svc } from './global-event.svc';
import { App_Const, GoogleMapsConfig_Mdl } from 'lm/site-common';

export const MapViewTypes: any = {
  map: 'map',
  streetview: 'streetview'
};

export const GoogleMapsImport: string = 'https://maps.googleapis.com/maps/api/js?key=$$API_KEY$$';

@Injectable()
export class GoogleMap_Svc {
  private geoCoder: google.maps.Geocoder;
  private mapsApiLoading: boolean = false;
  private mapsApiLoaded: boolean = false;
  private mapConfigs: Array<GoogleMapsConfig_Mdl> = [];
  private mapStyles: any = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ];
  private apiKey: any;

  constructor(private assetSvc: Asset_Svc,
              private configSvc: Config_Svc,
              private router: Router,
              private globalEventSvc: GlobalEvent_Svc,
              @Inject(App_Const) private constants) {
    this.apiKey = configSvc.getConfig(ConfigTypes.app).vendor.googleMaps.apiKey;
    this.router.events
      .pipe(filter(evt => evt instanceof NavigationStart))
      .subscribe(() => {
        for (let i = 0; i < this.mapConfigs.length; i++) {
          let id = this.mapConfigs[i].getResizeHandlerId();
          if (id !== null) {
            this.globalEventSvc.unregisterResizeHandler(id);
          }
        }
        this.mapConfigs = [];
      });
  }

  /**
   * This will handle loading the Google Maps API if necessary. If it's already loaded, we're good to go.
   *
   * @param mapObj {GoogleMapsConfig_Mdl}     The google maps config model to use to initialize the map with
   */
  initMap(mapObj: GoogleMapsConfig_Mdl) {
    this.mapConfigs.push(mapObj);

    if (!this.mapsApiLoaded && !this.mapsApiLoading) {
      this.mapsApiLoading = true;

      let s = document.createElement('script');

      s.src = GoogleMapsImport.replace('$$API_KEY$$', this.apiKey);
      s.onload = this.onMapsLoad.bind(this);
      document.getElementsByTagName('body')[0].appendChild(s);
    }
    else if (this.mapsApiLoaded) {
      this.loadObject(mapObj);
    }
  }

  /**
   * Fires when the google maps API load completes. This will only happen once per session (it won't be re-loaded on a
   * per-page basis).
   */
  private onMapsLoad() {
    this.mapsApiLoaded = true;
    this.mapsApiLoading = false;
    this.geoCoder = new google.maps.Geocoder();

    for (let i = 0; i < this.mapConfigs.length; i++) {
      this.loadObject(this.mapConfigs[i]);
    }
  }

  /**
   * This is where the branching occurs to load different types of map objects - maps, streetviews, etc.
   *
   * @param mapObj
   */
  private loadObject(mapObj: GoogleMapsConfig_Mdl) {
    let type = mapObj.getConfig().type;

    if (MapViewTypes.hasOwnProperty(type)) {
      switch (type) {
        case MapViewTypes.map:
          this.loadMap(mapObj);
          break;
        case MapViewTypes.streetview:
          this.loadStreetview(mapObj);
          break;
      }
    }
  }

  /**
   * Loads your standard Google Map
   * @param mapObj
   */
  private loadMap(mapObj: GoogleMapsConfig_Mdl) {
    let config: any = mapObj.getConfig();
    let el: any = mapObj.getNativeElement();
    let placeId: string = config.placeId;
    let location: any;

    this.doReverseGeocode(
      placeId,
      (function (results: any, status: any) {
        if (results[0]) {
          location = results[0].geometry.location;
          mapObj.setMap(
            new google.maps.Map(el, {
              zoom: 15,
              scrollwheel: false,
              styles: this.mapStyles,
              center: location
            })
          );

          mapObj.setResizeHandlerId(
            this.globalEventSvc.registerResizeHandler(function () {
              mapObj.getMap().setCenter(location);
            })
          );

          if (config.marker) {
            this.setMapMarker(mapObj.getMap(), location, config.marker);
          }
        }
        else {
          //TODO: make this display a UI error!
          console.error(`Maps loaded but the placeId [${placeId}] did not geocode properly. Check to make sure it is correct.`);
        }
      }).bind(this),
      function (results, status) {
        this.geocodeFailed(placeId, results, status);
      }.bind(this)
    );
  }

  /**
   * Loads a street view object
   * @param mapObj
   */
  private loadStreetview(mapObj: GoogleMapsConfig_Mdl) {
    let config: any = mapObj.getConfig();
    let el: any = mapObj.getNativeElement();
    let placeId: string = config.placeId;
    let location: any;

    this.doReverseGeocode(
      placeId,
      function (results: any, status: any) {
        if (results[0]) {
          location = results[0].geometry.location;
          mapObj.setMap(
            new google.maps.StreetViewPanorama(el, {
              position: location,
              scrollwheel: false,
              pov: {
                heading: 50,
                pitch: -15
              }
            })
          );
        }
        else {
          //TODO: make this display a UI error!
          console.error(`Maps loaded but the placeId [${placeId}] did not geocode properly. Check to make sure it is correct.`);
        }
      },
      function (results, status) {
        this.geocodeFailed(placeId, results, status);
      }
    );
  }

  /**
   * Requires a place ID to perform a reverse Geocode - essentially will end up returning a lat/long object.
   * @param placeId
   * @param successHandler
   * @param errorHandler
   */
  doReverseGeocode(placeId, successHandler, errorHandler) {
    this.geoCoder.geocode({'placeId': placeId}, (function (results: any, status: any) {
      if (status === 'OK') {
        successHandler(results, status);
      }
      else {
        errorHandler(results, status);
      }
    }));
  }

  /**
   * If geocode fails to work somehow, this will cover that case.
   * @param placeId
   * @param results
   * @param status
   */
  private geocodeFailed(placeId, results, status) {
    //TODO make this display a UI error!
    console.error(`Map failed to load- geocode on place id ${placeId} failed.`);
  }

  /**
   * Sets a marker on a map!
   * @param map
   * @param location
   * @param marker
   */
  private setMapMarker(map, location, marker) {
    new google.maps.Marker({
      position: location,
      map: map,
      icon: {
        size: new google.maps.Size(120, 120),
        scaledSize: new google.maps.Size(120, 120),
        url: this.assetSvc.getAssetUrl(marker)
      },
    });
  }
}