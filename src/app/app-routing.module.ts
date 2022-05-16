import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminRoutes } from './admin-panel/admin-panel.module';
import { ArticleComponent } from './article/article.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'admin', children: [...adminRoutes] },
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'article/:id',
    component: ArticleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
