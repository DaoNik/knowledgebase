import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './tasks-manager.component.html',
  styleUrls: ['./tasks-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksManagerComponent {}
