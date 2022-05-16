import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

interface adminArticle {
  id: string;
  header: string;
  tags: string[];
  teamlead: string[];
};

const mockArticles: adminArticle[] = [
  {
    id: 'id10',
    header: 'A 100 способов сделать это...100 способов сделать это...100 способов сделать это...',
    tags: ['тег1', 'тег2'],
    teamlead: ['username', 'username2', 'username3'],
  },
  {
    id: 'id20',
    header: 'B 100 способов сделать это...',
    tags: ['тег1', 'тег3'],
    teamlead: ['username'],
  },
  {
    id: 'id30',
    header: 'A 100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег3'],
    teamlead: ['username'],
  },
  {
    id: 'id40',
    header: '100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег3'],
    teamlead: ['username'],
  },
  {
    id: 'id50',
    header: '100 способов сделать это...',
    tags: ['тег1', 'тег2'],
    teamlead: ['username'],
  },
  {
    id: 'id60',
    header: '100 способов сделать это...',
    tags: ['тег2', 'тег3'],
    teamlead: ['username', 'username2'],
  },
  {
    id: 'id70',
    header: '100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег4'],
    teamlead: ['username'],
  }
];

@Component({
  selector: 'app-articles-table',
  templateUrl: './articles-table.component.html',
  styleUrls: ['./articles-table.component.scss']
})
export class ArticlesTableComponent implements OnInit {

  articles: adminArticle[] = mockArticles;
  articlesOnPage: number = 3;
  pages: number[] = [];

  currentArticles: adminArticle[] = this.articles;
  currentPageArticles: adminArticle[] = this.currentArticles.slice(0, this.articlesOnPage);
  currentPage: number = 1;

  checkedArticles: string[] = [];
  filterTags: string[] = [];

  search: FormControl = new FormControl('');
  tagInput: FormControl = new FormControl('');

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.countPages();
  }

  countPages(): void {
    this.pages = [];
    for (let i = 0; i < (this.currentArticles.length / this.articlesOnPage); i++) {
      this.pages.push(i + 1);
    }
  }

  pageClick(page: number): void {
    this.currentPage = page;
    const startArticle: number = (page - 1) * this.articlesOnPage;
    this.currentPageArticles = this.currentArticles.slice(startArticle, startArticle + this.articlesOnPage);
  }

  editArticle(articleId: string) {
    console.log('Эта штука откроет (желательно, в соседней вкладке) редактирование статьи');
    //this.router.navigateByUrl('тут урл на страницу редактирования');
  }

  deleteArticle(articleId: string) {
    this.currentArticles.splice(this.currentArticles.findIndex(article => article.id === articleId), 1);
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

  sortByFlag(flag: string): void {
    switch (flag) {
      case 'id':
        this.currentArticles = this.currentArticles.sort(this.sortByID);
        break;
      case 'header':
        this.currentArticles = this.currentArticles.sort(this.sortByAlphabet);
        break;
      case 'teamlead':
        this.currentArticles = this.currentArticles.sort(this.sortByTeamlead);
        break;
    }
    this.pageClick(this.currentPage);
  }

  resetPage(): void {
    this.currentPage = 1;
    this.pageClick(this.currentPage);
    this.countPages();
  }

  filterByTag(tag: string) {
    let tagInputValue = this.tagInput.value.trim();
    if (!this.filterTags.includes(tag)) {
      tagInputValue === '' ? this.tagInput.setValue(tag) : this.tagInput.setValue(this.tagInput.value + ', ' + tag);
      this.filterTags.push(tag);

      let temp: adminArticle[] = [];
      this.currentArticles.forEach(el => {
        if (el.tags.includes(tag)) {
          temp.push(el);
        }
      });
      this.currentArticles = temp;
    }
    else {
      tagInputValue = tagInputValue.split(', ').splice(tagInputValue.indexOf(tag), tag.length).join(', ');
      this.tagInput.setValue(tagInputValue);
      this.filterTags.splice(this.filterTags.indexOf(tag), 1);
      this.currentArticles = this.articles;

    }
    this.resetPage();
  }

  filterByTeamlead(teamlead: string) {
    if (!this.filterTags.includes(teamlead)) {
      this.filterTags.push(teamlead);
      let temp: adminArticle[] = [];
      this.currentArticles.forEach(el => {
        if (el.teamlead.includes(teamlead)) {
          temp.push(el);
        }
      });
      this.currentArticles = temp;
    }
    else {
      this.filterTags.splice(this.filterTags.indexOf(teamlead), 1);
      let filters: string[] = this.filterTags;
      this.filterTags = []
      this.currentArticles = this.articles;
      filters.forEach(tag => {
        this.filterByTeamlead(tag);
      });
    }
    this.resetPage();
  }
}
