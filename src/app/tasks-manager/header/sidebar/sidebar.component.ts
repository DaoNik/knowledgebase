import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public toggleOpacitySidebar = false

  constructor() { }

  ngOnInit(): void {
  }

  toggleOpacityToMain(): void {
    this.toggleOpacitySidebar = !this.toggleOpacitySidebar
  }

}
