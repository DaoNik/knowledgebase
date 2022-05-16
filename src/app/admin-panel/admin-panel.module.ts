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

export const adminRoutes: Routes = [
  {
    path: '', component: AdminPanelComponent, children: [
      { path: '', redirectTo: 'moderate', pathMatch: 'full' },
      { path: 'moderate', component: ArticleTableModerationComponent },
      { path: 'not-listed', component: ArticleNotListedComponent },
      { path: 'roles', component: RoleModerationComponent }
    ]
  }
];

@NgModule({
  declarations: [
    AdminPanelComponent,
    RoleModerationComponent,
    ArticleTableModerationComponent,
    ArticlesTableComponent,
    ArticleNotListedComponent,
    NotListedTableComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterModule.forChild(adminRoutes),

  ],
  exports: [
    AdminPanelComponent
  ]
})
export class AdminPanelModule { }
