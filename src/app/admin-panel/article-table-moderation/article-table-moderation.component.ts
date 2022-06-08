import { ChangeDetectionStrategy, Component } from '@angular/core';
import { first } from 'rxjs';
import { AdminPanelService } from '../admin-panel.service';

@Component({
  selector: 'app-article-table-moderation',
  templateUrl: './article-table-moderation.component.html',
  styleUrls: ['./article-table-moderation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleTableModerationComponent {
  topics: string[] = [];
  currentTopic: string = localStorage.getItem('categoryListed') || '';

  constructor(private adminService: AdminPanelService) {
    this.adminService
      .getCategories()
      .pipe(first())
      .subscribe((categories) => {
        this.topics = categories;
      });
  }

  clickTopic(topic: string): void {
    localStorage.setItem('categoryListed', topic);
    this.adminService.categoryListed.next(topic);
    this.currentTopic = topic;
  }
}
