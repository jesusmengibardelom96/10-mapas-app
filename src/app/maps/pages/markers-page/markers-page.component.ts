import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Map, LngLat, Marker } from 'mapbox-gl';

interface MarkerAndColor {
  marker: Marker
  color: string
}

interface PlainMarker {
  color: string
  lngLat: number[]
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css',
})
export class MarkersPageComponent implements AfterViewInit {

  @ViewChild('map')
  public divMap?: ElementRef;

  public map?: Map;

  public currentZoom: number = 13;

  public currtentLngLat: LngLat = new LngLat(-74.5, 40);

  public markerColors: MarkerAndColor[] = []


  ngAfterViewInit(): void {
    if (!this.divMap) throw 'El elemento HTML no fue encontrado';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currtentLngLat, // starting position [lng, lat]
      zoom: this.currentZoom, // starting zoom
    });

    /* const markerHtml = document.createElement('div')
    markerHtml.innerHTML = 'Yisus'

    const marker = new Marker({
      // color: 'red'
      element: markerHtml
    }).setLngLat(this.currtentLngLat).addTo(this.map) */

    this.readFromLocalStorage()
  }

  createMarker() {
    if (!this.map) return;
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const lngLat = this.map?.getCenter();
    this.addMarker(lngLat, color);
  }

  addMarker(lngLat: LngLat, color: string) {
    if (!this.map) return;

    const marker = new Marker({
      color,
      draggable: true,
    })
      .setLngLat(lngLat)
      .addTo(this.map);

      this.markerColors.push({color, marker})
      this.saveToLocalStorage()

      marker.on('dragend', (ev) => this.saveToLocalStorage());
  }

  deleteMarker(index: number) {
    this.markerColors[index].marker.remove()
    this.markerColors.splice(index, 1)
  }

  flyTo(marker: Marker) {
    if(!this.map) return

    this.map.flyTo({
      zoom: this.currentZoom,
      center: marker.getLngLat()
    })
  }

  saveToLocalStorage() {
    const plainMarkers: PlainMarker[] = this.markerColors.map(( {color, marker} ) => {
      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    })

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers))
  }

  readFromLocalStorage() {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]'
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString) //! OJO!

    plainMarkers.forEach(({color, lngLat}) => {
      const [ lng, lat ] = lngLat
      const coords = new LngLat(lng, lat)

      this.addMarker(coords, color)
    })
  }
}
