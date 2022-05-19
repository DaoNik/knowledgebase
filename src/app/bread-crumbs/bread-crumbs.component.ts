import { Component, OnInit } from '@angular/core';
import { IBreadcrumbs } from './breadcrumbs';
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-bread-crumbs',
  templateUrl: './bread-crumbs.component.html',
  styleUrls: ['./bread-crumbs.component.scss']
})
export class BreadCrumbsComponent implements OnInit {

  breadcrumbs: IBreadcrumbs[] = [];

  constructor(private router: Router) {
    this.router.events.subscribe(eventData => {
      if (eventData instanceof RoutesRecognized) {
        this.breadcrumbs = [];
        let currentUrlPart: ActivatedRouteSnapshot = eventData.state.root;
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

          currentUrlPart = currentUrlPart.children[0];
        }
      }
    })
   }

  ngOnInit(): void {
  }

}
