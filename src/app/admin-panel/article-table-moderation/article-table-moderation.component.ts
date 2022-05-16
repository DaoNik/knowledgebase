import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

const mockTopics: string[] = [
  'Приёмка', 'Отгрузка', 'Еще раздел', 'Еще раздел', 'Еще раздел'
];

@Component({
  selector: 'app-article-table-moderation',
  templateUrl: './article-table-moderation.component.html',
  styleUrls: ['./article-table-moderation.component.scss']
})
export class ArticleTableModerationComponent implements OnInit {

  topics: string[] = mockTopics;
  currentTopic: string = this.topics[0];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  clickTopic(topic: string): void {
    //здесь запрос на статьи по теме
    this.currentTopic = topic;
  }

  writeArticleButton() {
    console.log('Эта кнопка будет перенаправлять на страницу написания статьи');
    //this.router.navigateByUrl('тут урл на страницу написания статьи');
  }

}
