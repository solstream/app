import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {debounceTime, filter} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchUiService {

  search$ = new BehaviorSubject<string>(null);

  constructor() { }

  search(val: string): void {
    this.search$.next(val);
  }

  getChange(): Observable<string> {
    return this.search$.pipe(debounceTime(200));
  }
}
