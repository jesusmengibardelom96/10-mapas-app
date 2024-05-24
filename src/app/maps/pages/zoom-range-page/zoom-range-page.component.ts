import { AfterContentChecked, AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrl: './zoom-range-page.component.css',
})
export class ZoomRangePageComponent implements AfterViewInit, AfterContentChecked, OnDestroy {

  @ViewChild('map')
  public divMap?: ElementRef;

  public currentZoom: number = 10;

  public map?: Map;

  public currtentLngLat: LngLat = new LngLat(-74.5, 40);

  public currentLng?: number;
  public currentLat?: number;

  ngAfterViewInit(): void {
    if (!this.divMap) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currtentLngLat, // starting position [lng, lat]
      zoom: this.currentZoom, // starting zoom
    });

    this.mapListener();
  }

  ngAfterContentChecked(): void {
    const { lng, lat } = this.currtentLngLat;

    this.currentLat = lat;
    this.currentLng = lng;
  }

  ngOnDestroy(): void {
    this.map!.remove()
  }

  mapListener(): void {
    if (!this.map) throw 'Mapa no inicializado';

    this.map.on('zoomend', (ev) => {
      if (this.map!.getZoom() < 18) return;
      this.map!.zoomTo(18);
    });

    this.map.on('zoom', (ev) => {
      this.currentZoom = this.map!.getZoom();
    });

    this.map.on('move', (ev) => {
      this.currtentLngLat = this.map!.getCenter();

      const { lng, lat } = this.currtentLngLat;

      this.currentLat = lat;
      this.currentLng = lng;
    });
  }

  zoomChanged(value: string) {
    this.currentZoom = Number(value);

    this.map!.zoomTo(this.currentZoom);
  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomOut() {
    this.map?.zoomOut();
  }
}
