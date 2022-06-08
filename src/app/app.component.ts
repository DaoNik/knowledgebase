import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ErrorModalService } from './error-modal/error-modal.service';
import { Router, RouterOutlet } from '@angular/router';
import { routeChangeAnimation } from './change-route-animation';
import { errorAnimation } from './error-animation';

@Component({
  selector: 'app-root',
  animations: [errorAnimation, routeChangeAnimation],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'База знаний WB';
  visibleError!: boolean;

  constructor(private errorService: ErrorModalService, public router: Router) {}

  ngOnInit(): void {
    this.visibleError = this.errorService.visibleError;
  }

  ngAfterContentChecked(): void {
    this.visibleError = this.errorService.visibleError;
  }

  getRouteAnimationState(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

  getIsFormIssue() {
    return !this.router.url.includes('form-issue');
  }
}
