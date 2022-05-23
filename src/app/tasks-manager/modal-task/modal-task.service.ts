import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalTaskComponent } from './modal-task.component';

@Injectable({
  providedIn: 'root'
})
export class ModalTaskService {
  constructor(
    public dialog: MatDialog
  ) {}

  openDialog(data?: any): void {
    const dialogRef = this.dialog.open(ModalTaskComponent, {
      panelClass: 'modal-task-global',
      data: data,
      maxWidth: '1000px',
      width: '90%'
    });
  }
}
