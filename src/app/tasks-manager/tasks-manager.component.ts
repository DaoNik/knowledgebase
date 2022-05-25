import { Component } from '@angular/core';
import { TasksManagerService } from './tasks-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './tasks-manager.component.html',
  styleUrls: ['./tasks-manager.component.scss'],
})
export class TasksManagerComponent {
  constructor(private taskServ: TasksManagerService) {
    this.taskServ.getTasks().subscribe()
  }
}
