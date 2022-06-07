import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ErrorModalService } from './error-modal/error-modal.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { RouterOutlet } from '@angular/router';
import { routeChangeAnimation } from './change-route-animation';

@Component({
  selector: 'app-root',
  animations: [
    trigger('errorAnimation', [
      transition(':enter', [
        style({ transform: 'opacity(0)', opacity: 0 }),
        animate('300ms', style({ transform: 'opacity(1)', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ transform: 'opacity(1)', opacity: 1 }),
        animate('300ms', style({ transform: 'opacity(0)', opacity: 0 })),
      ]),
    ]),
    routeChangeAnimation,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'База знаний WB';
  visibleError!: boolean;

  constructor(private errorService: ErrorModalService) {}

  ngOnInit(): void {
    this.visibleError = this.errorService.visibleError;
  }

  ngAfterContentChecked(): void {
    this.visibleError = this.errorService.visibleError;
  }

  getRouteAnimationState(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
}
