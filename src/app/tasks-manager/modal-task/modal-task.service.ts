import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalTaskComponent } from './modal-task.component';

@Injectable({
  providedIn: 'root'
})
export class ModalTaskService {
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  openDialog(data?: any): void {
    const dialogRef = this.dialog.open(ModalTaskComponent, {
      panelClass: 'modal-task-global',
      data: data,
      maxWidth: '700px',
      width: '90%'
    });
  }
}
