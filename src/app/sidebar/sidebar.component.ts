import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  public toggleOpacitySidebar = false

  toggleOpacityToMain(): void {
    this.toggleOpacitySidebar = !this.toggleOpacitySidebar
  }

}
