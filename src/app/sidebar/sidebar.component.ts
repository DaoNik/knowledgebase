import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  public toggleOpacitySidebar = false;

  @ViewChild('sidebarCheckbox') sidebarCheckbox!: ElementRef<HTMLInputElement>;

  toggleOpacityToMain(): void {
    this.toggleOpacitySidebar = !this.toggleOpacitySidebar;
  }

  closeSidebar(): void {
    this.toggleOpacityToMain();
    this.sidebarCheckbox.nativeElement.checked = false;
  }
}
