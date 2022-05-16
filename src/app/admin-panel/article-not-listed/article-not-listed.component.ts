import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const mockTopics: string[] = [
  'Тема 1', 'Тема 2'
];

@Component({
  selector: 'app-article-not-listed',
  templateUrl: './article-not-listed.component.html',
  styleUrls: ['./article-not-listed.component.scss']
})
export class ArticleNotListedComponent implements OnInit {

  topics: string[] = mockTopics;
  currentTopic: string = this.topics[0];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  clickTopic(topic: string): void {
    //здесь запрос на статьи по теме
    this.currentTopic = topic;
  }

}
