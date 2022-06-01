import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { ModalTaskService } from '../modal-task/modal-task.service';
import { TasksManagerService } from '../tasks-manager.service';

export interface ITableTasks {
  id: number;
  title: string;
  status: string;
  departments: string[];
  priority: string;
}

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss'],
})
export class TasksTableComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'title',
    'status',
    'departments',
    'priority',
  ];

  subscriptionTasks$!: Subscription;

  tasks$ = this.taskServ.getTasks();
  filterTasks: ITableTasks[] = [];

  dataSource!: MatTableDataSource<ITableTasks>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private elRef: ElementRef,
    private taskServ: TasksManagerService,
    private modalServ: ModalTaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscriptionTasks$ = this.tasks$
      .pipe(
        map((tasks) => {
          return tasks.map((task) => {
            return {
              id: task.id,
              title: task.title,
              status: task.status,
              departments: task.authors,
              priority: task.priority,
            };
          });
        })
      )
      .subscribe((tasks) => {
        this.dataSource = new MatTableDataSource(
          tasks.sort((a, b) => a.id - b.id)
        );
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngAfterViewInit() {
    this.elRef.nativeElement.querySelector(
      '.mat-paginator-page-size-label'
    ).textContent = 'Отобразить: ';
  }

  ngOnDestroy() {
    this.subscriptionTasks$.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
