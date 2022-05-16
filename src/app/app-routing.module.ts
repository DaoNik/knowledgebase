import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { adminRoutes } from './admin-panel/admin-panel.module';
import { CreateArticleComponent } from './create-article/create-article.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'create', component: CreateArticleComponent },
  { path: 'edit/:id', component: CreateArticleComponent },
  { path: 'admin', children: [...adminRoutes] },
  {
    path: '',
    component: MainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
