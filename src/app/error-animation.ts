import { animate, style, transition, trigger } from '@angular/animations';

export const errorAnimation = trigger('errorAnimation', [
  transition(':enter', [
    style({ transform: 'opacity(0)', opacity: 0 }),
    animate('300ms', style({ transform: 'opacity(1)', opacity: 1 })),
  ]),
  transition(':leave', [
    style({ transform: 'opacity(1)', opacity: 1 }),
    animate('300ms', style({ transform: 'opacity(0)', opacity: 0 })),
  ]),
]);
