import { Injectable } from '@angular/core';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { PreloadingStrategy, Route } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, loadMe: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
      var delay: number = route.data['delay'];
      return timer(delay).pipe(
        mergeMap((_) => {
          return loadMe();
        })
      );
    } else {
      return of(null);
    }
  }
}
