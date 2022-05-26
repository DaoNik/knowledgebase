import {
  Component,
  ViewChild,
  AfterViewInit,
  ElementRef,
  OnInit,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, pipe } from 'rxjs';
import { ITask } from '../interfaces/taskList.interface';
import { TasksManagerService } from '../tasks-manager.service';

export interface ITableTasks {
  id: number;
  title: string;
  status: string;
  respondents: string[];
  priority: string;
}

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss'],
})
export class TasksTableComponent
  implements OnInit, AfterViewInit
{
  displayedColumns: string[] = [
    'id',
    'title',
    'status',
    'respondents',
    'priority',
  ];

  tasks$ = this.taskServ.getTasks();
  filterTasks: ITableTasks[] = [];

  dataSource!: MatTableDataSource<ITableTasks>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private elRef: ElementRef,
    private taskServ: TasksManagerService
  ) {}

  ngOnInit(): void {
    this.tasks$.pipe(
      map((tasks) => {
        tasks.map((task) => {
          this.filterTasks.push(
           {
              id: task.id, 
              title: task.title, 
              status: task.status, 
              respondents: task.respondents,
              priority: task.priority
            }
          )
        })
      })
    ).subscribe(() => {
      this.dataSource = new MatTableDataSource(this.filterTasks.sort());

    })

  }

  ngAfterViewInit() {
    this.elRef.nativeElement.querySelector(
      '.mat-paginator-page-size-label'
    ).textContent = 'Отобразить: ';

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
