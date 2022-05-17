import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminPanelService } from '../admin-panel.service';

const mockTopics: string[] = [
  'Склад',
  'Серверная сторона',
  'Еще раздел',
  'Еще раздел',
  'Еще раздел',
];

@Component({
  selector: 'app-article-table-moderation',
  templateUrl: './article-table-moderation.component.html',
  styleUrls: ['./article-table-moderation.component.scss'],
})
export class ArticleTableModerationComponent implements OnInit {
  topics: string[] = mockTopics;
  currentTopic: string = localStorage.getItem('categoryListed') || 'Склад';

  constructor(private adminService: AdminPanelService) {}

  ngOnInit(): void {}

  clickTopic(topic: string): void {
    localStorage.setItem('categoryListed', topic);
    this.adminService.categoryListed.next(topic);
    this.currentTopic = topic;
  }
}
