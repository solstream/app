import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
// TODO deprecated, looks not needed anymore, check why fullscreen component is using it
export class CinemaActions {

    roomLeft$ = new BehaviorSubject(false);

    constructor() {
    }

    fireLeftRoom(): void {
        this.roomLeft$.next(true);
    }

    observeLeaveRoom(): Observable<boolean> {
        return this.roomLeft$.asObservable().pipe(filter(x => x));
    }

}
