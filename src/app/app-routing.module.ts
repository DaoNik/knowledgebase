import { NgModule } from '@angular/core';
import { PreloadingStrategy, RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ArticleComponent } from './article/article.component';
import { CustomPreloadingStrategy } from './custom-preloading-strategy';
import { MainComponent } from './main/main.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { TasksManagerComponent } from './tasks-manager/tasks-manager.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminPanelComponent,
    loadChildren: () =>
      import('./admin-panel/admin-panel.module').then(
        (m) => m.AdminPanelModule
      ),
    data: { displayName: 'Админка', animation: 'admin', preload: true, delay: 10000 },
  },
  {
    path: 'tasks',
    component: TasksManagerComponent,
    loadChildren: () =>
      import('./tasks-manager/tasks-manager.module').then(
        (m) => m.TasksManagerModule
      ),
    data: { displayName: 'Менеджер задач', animation: 'tasks'},
  },
  {
    path: '',
    component: MainComponent,
    data: {
      displayName: 'Главная',
      animation: 'main',
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
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: CustomPreloadingStrategy
    })
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
