import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


interface MenuItem {
  name: string
  route: string
}

@Component({
  selector: 'side-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.css'
})
export class SideMenuComponent {

  public menuItems: MenuItem[] = [
    {route: '/maps/fullscreen', name: 'FullScreen'},
    {route: '/maps/markers', name: 'Markers'},
    {route: '/maps/properties', name: 'Properties'},
    {route: '/maps/zoom-range', name: 'Zoom Range'},
    {route: '/alone', name: 'Alone Page'},
  ]

}
