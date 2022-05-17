import { Component, OnInit } from '@angular/core';
import { AdminPanelService } from '../admin-panel.service';

const mockTopics: string[] = ['Склад', 'Базы данных'];

@Component({
  selector: 'app-article-not-listed',
  templateUrl: './article-not-listed.component.html',
  styleUrls: ['./article-not-listed.component.scss'],
})
export class ArticleNotListedComponent implements OnInit {
  topics: string[] = mockTopics;
  currentTopic: string = localStorage.getItem('categoryNotListed') || 'Склад';

  constructor(
    private adminPanelService: AdminPanelService
  ) {}

  ngOnInit(): void {}

  clickTopic(topic: string): void {
    this.adminPanelService.categoryNotListed.next(topic);
    this.currentTopic = topic;
    localStorage.setItem('categoryNotListed', topic)
  }
}
