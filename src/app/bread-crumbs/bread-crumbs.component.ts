import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { IBreadcrumbs } from './breadcrumbs';
import {
  ActivatedRouteSnapshot,
  Router,
  RoutesRecognized,
} from '@angular/router';
import { BreadCrumbsService } from './bread-crumbs.service';
import { IArticle } from '../interfaces/article';

@Component({
  selector: 'app-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadCrumbsComponent {
  breadcrumbs: IBreadcrumbs[] = [];

  constructor(
    private router: Router,
    private breadService: BreadCrumbsService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.router.events.subscribe((eventData) => {
      if (eventData instanceof RoutesRecognized) {
        this.breadcrumbs = [];
        let currentUrlPart: ActivatedRouteSnapshot = eventData.state.root;
        let currUrl: string = '';

        while (currentUrlPart.children.length > 0) {
          const routeSnaphot: ActivatedRouteSnapshot =
            currentUrlPart.children[0];

          currUrl +=
            '/' +
            routeSnaphot.url
              .map(function (item) {
                return item.path;
              })
              .join('/');

          this.breadcrumbs.push({
            displayName: routeSnaphot.data['displayName'],
            url: currUrl,
            params: routeSnaphot.params,
          });

          // console.log(this.breadcrumbs)
          // console.log(currentUrlPart)

          if (
            this.breadcrumbs[this.breadcrumbs.length - 1].displayName ==
            'Номер статьи'
          ) {
            this.breadService
              .getArticle(
                this.breadcrumbs[this.breadcrumbs.length - 1].params['id']
              )
              .subscribe((item: IArticle) => {
                this.breadcrumbs[this.breadcrumbs.length - 1].displayName =
                  item.title;
                this.breadcrumbs[this.breadcrumbs.length - 2].displayName =
                  item.category;
                this.breadcrumbs[
                  this.breadcrumbs.length - 2
                ].url = `CATEGORY/${item.category}`;
                this.changeDetectorRef.markForCheck();
              });
          }
          currentUrlPart = currentUrlPart.children[0];
        }
        if (this.breadcrumbs[this.breadcrumbs.length - 2]?.displayName ==
          'Результаты поиска' || this.breadcrumbs[this.breadcrumbs.length - 3]?.displayName ==
          'Результаты поиска') {
            // console.log(this.breadcrumbs)
            this.breadcrumbs = [{
              displayName: 'Поиск',
              url: this.breadcrumbs[this.breadcrumbs.length - 1].url,
              params: this.breadcrumbs[this.breadcrumbs.length - 1].params,
            }]
            // console.log(this.breadcrumbs)
        }
      }
      this.changeDetectorRef.markForCheck();
    });
  }

  redirect(url: string) {
    if (url.includes('CATEGORY')) {
      const category = url.split('/');
      this.router.navigate(['search-result', `${category[1]}`, ``]);
    } else if (this.breadcrumbs[0].displayName = 'Поиск') {
      this.router.navigate([url]);
    } else if (this.breadcrumbs.length <= 1) {
      this.router.navigate(['']);
    } else {
      this.router.navigate([url]);
    }
  }
}
