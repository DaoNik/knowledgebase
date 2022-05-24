import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
//Material UI
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';

import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './header/sidebar/sidebar.component';
import { MainComponent } from './main/main.component';
import { FormIssueComponent } from './form-issue/form-issue.component';
import { ModalTaskComponent } from './modal-task/modal-task.component';
import { RouterModule, Routes } from '@angular/router';
import { TasksManagerComponent } from './tasks-manager.component';
import { ModalTaskService } from './modal-task/modal-task.service';
import { ModalTaskEntryComponent } from './modal-task/modal-task-entry.component';

const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'tasks', component: MainComponent,
    children: [
      {
        path: ':item',
        component: ModalTaskEntryComponent,
        data: {
          displayName: 'Задача',
        },
      },
    ], 
  },
  { path: 'form', component: FormIssueComponent },
];

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    MainComponent,
    FormIssueComponent,
    ModalTaskComponent,
    TasksManagerComponent,
  ],
  imports: [
    DragDropModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),

    // Material UI
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatTabsModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    MatRippleModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatBadgeModule,
  ],
  exports: [TasksManagerComponent],
})
export class TasksManagerModule {}
