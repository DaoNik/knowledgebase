import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

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
      title: 'Доставка',
      status: false
    },
    {
      title: 'Аккаунт',
      status: false
    },
    {
      title: 'Получение товара',
      status: false
    }
  ]
  filteredResults!: Observable<string[]>;

  constructor() { }

  ngOnInit(): void {
    this.filteredResults = this.searchQuery.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.results.filter(result => result.toLowerCase().includes(filterValue));
  }

  search() {
    const filterTags = this.filterOptions.filter(item => { return item.status })
                                  .map(item => { return item.title });
    console.log(`searching for ${this.searchQuery.value} in ${filterTags}`)
  }
}
