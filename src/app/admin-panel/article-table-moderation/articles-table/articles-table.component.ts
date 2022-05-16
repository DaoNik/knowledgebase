import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

interface adminArticle {
  id: string;
  header: string;
  tags: string[];
  teamlead: string;
};

const mockArticles: adminArticle[] = [
  {
    id: 'id10',
    header: 'A 100 способов сделать это...100 способов сделать это...100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег3'],
    teamlead: 'username',
  },
  {
    id: 'id20',
    header: 'B 100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег3'],
    teamlead: 'username',
  },
  {
    id: 'id30',
    header: 'A 100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег3'],
    teamlead: 'username',
  },
  {
    id: 'id40',
    header: '100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег3'],
    teamlead: 'username',
  },
  {
    id: 'id50',
    header: '100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег3'],
    teamlead: 'username',
  },
  {
    id: 'id60',
    header: '100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег3'],
    teamlead: 'username',
  },
  {
    id: 'id70',
    header: '100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег3'],
    teamlead: 'username',
  }
];

@Component({
  selector: 'app-articles-table',
  templateUrl: './articles-table.component.html',
  styleUrls: ['./articles-table.component.scss']
})
export class ArticlesTableComponent implements OnInit {

  @ViewChild ('pagination') pagination!: Element;

  articles: adminArticle[] = mockArticles;
  articlesOnPage: number = 3;
  pages: number[] = [];

  currentPageArticles: adminArticle[] = this.articles.slice(0, this.articlesOnPage);
  currentPage: number = 1;

  checkedArticles: string[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.countPages();
    console.log(this.pagination);
  }

  ngAfterViewInit() {
    console.log(this.pagination);
    console.log(this.pagination.children);
  }

  countPages(): void {
    this.pages = [];
    for (let i = 0; i < (this.articles.length / this.articlesOnPage); i++) {
      this.pages.push(i + 1);
    }
  }

  pageClick(page: number): void {
    this.currentPage = page;
    const startArticle: number = (page - 1) * this.articlesOnPage;
    this.currentPageArticles = this.articles.slice(startArticle, startArticle + this.articlesOnPage);
  }

  editArticle(articleId: string) {
    console.log('Эта штука откроет (желательно, в соседней вкладке) редактирование статьи');
    //this.router.navigateByUrl('тут урл на страницу редактирования');
  }

  deleteArticle(articleId: string) {
    this.articles.splice(this.articles.findIndex(article => article.id === articleId), 1);
    this.pageClick(this.currentPage);
    this.countPages();
    //здесь запросик на удаление статьи
  }

  checkArticle(articleId: string): void {
    if (!this.checkedArticles.includes(articleId)) {
      this.checkedArticles.push(articleId);
    }
    else {
      this.checkedArticles.splice(this.checkedArticles.indexOf(articleId), 1);
    }
  }

  sortByAlphabet(prev: adminArticle, next: adminArticle): number {
    return prev.header < next.header ? -1 : (prev.header > next.header) ? 1 : 0;
  }

  sortByID(prev: adminArticle, next: adminArticle): number {
    return prev.id < next.id ? -1 : (prev.id > next.id) ? 1 : 0;
  }

  sortByTeamlead(prev: adminArticle, next: adminArticle): number {
    return prev.teamlead < next.teamlead ? -1 : (prev.teamlead > next.teamlead) ? 1 : 0;
  }

  sortByTags(prev: adminArticle, next: adminArticle): number {
    if (prev.tags[0] < next.tags[0]) { return -1; }
    if (prev.tags[0] > next.tags[0]) { return 1; }
    return 0;
  }

  sortByFlag(flag: string): void {
    switch (flag) {
      case 'id':
        this.articles = this.articles.sort(this.sortByID);
        break;
      case 'header':
        this.articles = this.articles.sort(this.sortByAlphabet);
        break;
      case 'tags':
        this.articles = this.articles.sort(this.sortByTags);
        break;
      case 'teamlead':
        this.articles = this.articles.sort(this.sortByTeamlead);
        break;
    }
    this.pageClick(this.currentPage);
  }
}
