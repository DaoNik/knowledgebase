import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ArticleComponent } from './article/article.component';
import { MainComponent } from './main/main.component';
import { SearchResultsComponent } from './search-results/search-results.component';

const routes: Routes = [
  {
    path: 'admin',
    data: { displayName: "Админка"},
    component: AdminPanelComponent,
    loadChildren: () => import('./admin-panel/admin-panel.module').then(m => m.AdminPanelModule),
  },
  {
    path: '',
    component: MainComponent,
    data: {
      displayName: 'Главная'
    },
  },
  {
    path: 'article/:id',
    component: ArticleComponent,
    data: {
      displayName: 'Статья'
    },
  },
  {
    path: 'search-result/:title/:categories',
    component: SearchResultsComponent,
    data: {
      displayName: 'Результаты поиска'
    },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
