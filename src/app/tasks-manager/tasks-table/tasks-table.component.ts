import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ITask } from '../interfaces/taskList.interface';
import { TasksManagerService } from '../tasks-manager.service';

export interface IUserData {
  id: string;
  name: string;
  progress: string;
  assigne: string;
  priority: string;
}

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss'],
})
export class TasksTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'progress', 'assigne', 'priority'];

  // articles: IUserData[] = [
  //   {
  //     id: '1',
  //     name: 'Maia',
  //     progress: 'Done',
  //     assigne: 'Maia',
  //     priority: 'Medium'
  //   },
  //   {
  //     id: '2',
  //     name: 'Asher',
  //     progress: 'in Progress',
  //     assigne: 'Asher',
  //     priority: 'Low'
  //   },
  //   {
  //     id: '30',
  //     name: 'Atticus',
  //     progress: 'To Do',
  //     assigne: 'Atticus',
  //     priority: 'Medium'
  //   },
  //   {
  //     id: '4',
  //     name: 'Olivia',
  //     progress: 'Done',
  //     assigne: 'Olivia',
  //     priority: 'Low'
  //   },
  //   {
  //     id: '5',
  //     name: 'Olivia',
  //     progress: 'in Progress',
  //     assigne: 'Olivia',
  //     priority: 'High'
  //   },
  // ]

  dataSource!: MatTableDataSource<ITask>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private elRef: ElementRef, private taskServ: TasksManagerService) {
    // this.dataSource = new MatTableDataSource(this.articles);
    this.taskServ.getTasks().subscribe(tasks => this.dataSource = new MatTableDataSource(tasks));
  }

  ngAfterViewInit() {
    this.elRef.nativeElement.querySelector(
      '.mat-paginator-page-size-label'
    ).textContent = 'Отобразить: ';

    console.log(this.dataSource.sort)
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
