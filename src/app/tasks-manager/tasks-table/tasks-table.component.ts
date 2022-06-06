import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { map, Subject, takeUntil } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksTableComponent implements OnInit, AfterViewChecked, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'title',
    'status',
    'departments',
    'priority',
  ];

  private destroySubscribes$ = new Subject<boolean>();

  tasks$ = this.taskServ.getTasks();
  filterTasks: ITableTasks[] = [];

  dataSource!: MatTableDataSource<ITableTasks>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(
    private elRef: ElementRef,
    private taskServ: TasksManagerService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getTasks();
  }

  ngAfterViewChecked(): void {
    const textElement = this.elRef.nativeElement.querySelector(
      '.mat-paginator-page-size-label'
    );
    if (textElement) {
      textElement.textContent = 'Отобразить: ';
    }
  }

  ngOnDestroy() {
    this.destroySubscribes$.next(true);
  }

  getTasks(): void {
    this.tasks$
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
      }),
      takeUntil(this.destroySubscribes$)
    )
    .subscribe((tasks) => {
      this.dataSource = new MatTableDataSource(
        tasks.sort((a, b) => a.id - b.id)
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.changeDetectorRef.markForCheck();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
