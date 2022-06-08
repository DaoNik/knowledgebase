import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RoleModerationComponent } from './role-moderation/role-moderation.component';
import { ArticleTableModerationComponent } from './article-table-moderation/article-table-moderation.component';
import { ArticlesTableComponent } from './article-table-moderation/articles-table/articles-table.component';
import { ArticleNotListedComponent } from './article-not-listed/article-not-listed.component';
import { NotListedTableComponent } from './article-not-listed/not-listed-table/not-listed-table.component';
import { CreateArticleComponent } from '../create-edit-article/create-article/create-article.component';
import { EditArticleComponent } from '../create-edit-article/edit-article/edit-article.component';

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'moderate', pathMatch: 'full' },
  {
    path: 'moderate',
    component: ArticleTableModerationComponent,
    data: { displayName: 'Модерирование статей' },
  },
  {
    path: 'roles',
    component: RoleModerationComponent,
    data: { displayName: 'Назначение ролей' },
  },
  {
    path: 'create',
    component: CreateArticleComponent,
    data: { displayName: 'Создать статью' },
  },
  {
    path: 'edit/:id',
    component: EditArticleComponent,
    data: { displayName: 'Редактировать статью' },
  },
  {
    path: 'not-listed',
    component: ArticleNotListedComponent,
    data: { displayName: 'В ожидании одобрения' },
  },
];

@NgModule({
  declarations: [
    AdminPanelComponent,
    RoleModerationComponent,
    ArticleTableModerationComponent,
    ArticlesTableComponent,
    ArticleNotListedComponent,
    NotListedTableComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(adminRoutes),
  ],
  exports: [AdminPanelComponent],
})
export class AdminPanelModule {}
