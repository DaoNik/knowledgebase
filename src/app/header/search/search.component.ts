import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { IArticle } from 'src/app/interfaces/article';
import { SearchService } from './search.service';

interface IFilter {
  title: string,
  status: boolean
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchQuery = new FormControl();
  results: string[] = ['One', 'Two', 'Three'];
  filterOptions: IFilter[] = [
    {
      title: 'Логистика',
      status: false
    },
    {
      title: 'Серверная сторона',
      status: false
    },
    {
      title: 'Базы данных',
      status: false
    },
    {
      title: 'Клиентская сторона',
      status: false
    },
    {
      title: 'Склад',
      status: false
    },
    {
      title: 'Пункты выдачи',
      status: false
    }
  ]
  filteredResults!: Observable<IArticle[]>;
  foundArticles!: IArticle[];

  constructor(
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.filteredResults = this.searchQuery.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    this.searchService.getArticles()
    .subscribe((articles: IArticle[]) => this.foundArticles = articles)
  }

  private _filter(value: string): IArticle[] {
    const filterValue = value.toLowerCase();
    const filterTags = this.filterOptions.filter(item => { return item.status })
                                  .map(item => { return item.title });
    if (this.foundArticles) return this.foundArticles.filter(result => result.title.toLowerCase().includes(filterValue) && filterTags.includes(result.category));
    else return this.foundArticles
  }

  search() {
    const filterTags = this.filterOptions.filter(item => { return item.status })
                                  .map(item => { return item.title });
    console.log(`searching for ${this.searchQuery.value} in ${filterTags}`)
  }

  goToArticle(article: IArticle) {
    console.log('going to article ' + article.title + '\nid: ' + article.id)
  }
}
