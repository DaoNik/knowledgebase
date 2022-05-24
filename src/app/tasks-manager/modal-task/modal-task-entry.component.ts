import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalTaskComponent } from './modal-task.component';

@Component({
  template: ''
})
export class ModalTaskEntryComponent {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const url = this.router.url.split('/')
    this.openDialog(url[url.length - 1].replace(/%20/g, ' '));
  }

  openDialog(data?: any): void {
    const dialogRef = this.dialog.open(ModalTaskComponent, {
      panelClass: 'modal-task-global',
      data: data,
      maxWidth: '700px',
      width: '90%'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
