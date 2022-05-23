import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ArticleComponent } from './article/article.component';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { TasksManagerComponent } from './tasks-manager/tasks-manager.component';

const routes: Routes = [
  {
    path: 'admin',
    data: { displayName: 'Админка' },
    component: AdminPanelComponent,
    loadChildren: () =>
      import('./admin-panel/admin-panel.module').then(
        (m) => m.AdminPanelModule
      ),
  },
  {
    path: 'tasks-manager',
    data: { displayName: 'Task Manager' },
    component: TasksManagerComponent,
    loadChildren: () =>
      import('./tasks-manager/tasks-manager.module').then(
        (m) => m.TasksManagerModule
      ),
  },
  {
    path: '',
    component: MainComponent,
    data: {
      displayName: 'Главная',
    },
  },
  {
    path: 'article',
    data: {
      displayName: 'Статья',
    },
    children: [
      {
        path: ':id',
        component: ArticleComponent,
        data: {
          displayName: 'Номер статьи',
        },
      },
    ],
  },
  {
    path: 'search-result/:title/:categories',
    component: SearchResultsComponent,
    data: {
      displayName: 'Результаты поиска',
    },
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
