import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, Observable, throwError } from 'rxjs';
import { ModalTaskComponent } from './modal-task.component';

@Injectable({
  providedIn: 'root'
})
export class ModalTaskService {

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
  ) {
  }

  openDialog(data?: any): void {
    const dialogRef = this.dialog.open(ModalTaskComponent, {
      panelClass: 'modal-task-global',
      data: data,
      maxWidth: '900px',
      width: '90%'
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log(res)
    })
  }
}
