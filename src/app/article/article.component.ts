import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IArticle } from '../interfaces/article';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  articles: IArticle[] = [
    {
      id: 1,
      title: 'Как кинуть Карину в мут?',
      category: 'Мут',
      description: 'Берешь и перетаскиваешь в мут, что еще думать то?!',
      dateCreate: '1652442180701',
      dateUpdate: '1652442180701',
      authors: ['Yaunberzinsh Alexander', 'Taranin Nikita'],
      respondents: ['Taranin Nikita', 'Berezhnov Nikita'],
      content:
        'На сервере в дискорде во время голосового звонка на компьютере можно перетащить мышкой Карину в голосовой канал мут.',
      tags: [],
    },
  ];

  articleId!: number;

  constructor(
    private articlesServ: ArticleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.articlesServ
      .getArticles()
      .subscribe((articles: IArticle[]) => (this.articles = articles));
    this.route.params.subscribe((params: Params) => {
      this.articleId = Number(params['id']);
    });
  }
}
