import { Component, OnInit } from '@angular/core';
import { IBreadcrumbs } from './breadcrumbs';
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';
import { BreadCrumbsService } from './bread-crumbs.service';
import { IArticle } from '../interfaces/article';

@Component({
  selector: 'app-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.scss']
})
export class BreadCrumbsComponent implements OnInit {

  breadcrumbs: IBreadcrumbs[] = [];

  constructor(
    private router: Router,
    private breadService: BreadCrumbsService
  ) {
    this.router.events.subscribe(eventData => {
      if (eventData instanceof RoutesRecognized) {
        this.breadcrumbs = [];
        let currentUrlPart: ActivatedRouteSnapshot = eventData.state.root;
        console.log(currentUrlPart.children.length)
        let currUrl: string = '';

        while (currentUrlPart.children.length > 0) {
          const routeSnaphot: ActivatedRouteSnapshot = currentUrlPart.children[0];

          currUrl += '/' + routeSnaphot.url.map(function (item) {
            return item.path;
          }).join('/');

          this.breadcrumbs.push({
            displayName: routeSnaphot.data['displayName'],
            url: currUrl,
            params: routeSnaphot.params
          });

          if (this.breadcrumbs[this.breadcrumbs.length - 1].displayName == 'Номер статьи') {

            this.breadService.getArticle(this.breadcrumbs[this.breadcrumbs.length - 1].params['id']).subscribe((item: IArticle) => {

              this.breadcrumbs[this.breadcrumbs.length - 1].displayName = item.title;
              this.breadcrumbs[this.breadcrumbs.length - 2].displayName = item.category;
              this.breadcrumbs[this.breadcrumbs.length - 2].url = `CATEGORY/${item.category}`;

            })

          }
          currentUrlPart = currentUrlPart.children[0];
        }
        console.log(currUrl)
      }
    })
   }

  redirect(url: string) {
    if (url.includes('CATEGORY')) {
      const category = url.split('/')
      this.router.navigate(['search-result', ``, `${category[1]}`]);
    } else if (this.breadcrumbs.length <= 1) {
      this.router.navigate(['']);
    } else {
      this.router.navigate([url]);
    }
  }

  ngOnInit(): void {
    console.log(this.breadcrumbs)
  }

}
