import { Component, OnInit } from '@angular/core';
import { IArticle } from '../interfaces/article';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  articles: IArticle[] = [{
    id: 1,
    title: "Как кинуть Карину в мут?",
    category: "Мут",
    description: "Берешь и перетаскиваешь в мут, что еще думать то?!",
    dateCreate: "14:54 13.05.2022",
    dateUpdate: "14:55 13.05.2022",
    authors: ["Yaunberzinsh Alexander", "Taranin Nikita"],
    respondents: ["Taranin Nikita", "Berezhnov Nikita"],
    content: {
      text: "На сервере в дискорде во время голосового звонка на компьютере можно перетащить мышкой Карину в голосовой канал мут.",
      image: ""
    },
    tags: []
  }]

  constructor(
    private articlesServ: ArticleService
  ) { }

  ngOnInit(): void {
    this.articlesServ.getArticles()
    .subscribe((articles: IArticle[]) => this.articles = articles)
  }

}
