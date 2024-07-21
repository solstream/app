import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {AccountModel} from '../../../_core/model/accountModel';

@Injectable({
    providedIn: 'root'
})
export class StreamerContextState {

    hostRoom$ = new BehaviorSubject<AccountModel>(null);
    screenShare$ = new BehaviorSubject(false);
    video$ = new Subject<boolean>();
    live$ = new BehaviorSubject<boolean>(null);
    liveTerminationInProgress$ = new BehaviorSubject<boolean>(false);
    recordStream$ = new BehaviorSubject<boolean>(false);
    streamTitle$ = new BehaviorSubject<string>(null);

    constructor() {
    }

    clearState(): void {
        this.hostRoom$.next(null);
        this.screenShare$.next(false);
        this.video$.next(null);
        this.live$.next(null);
        this.streamTitle$.next(null);
        this.liveTerminationInProgress$.next(false);
    }

    getHostRoom(): Observable<AccountModel> {
        return this.hostRoom$.pipe(filter(x => x !== null));
    }

    initializeState(streamTitle: string, videoEnabled: boolean): void {
        this.live$.next(true);
        this.video$.next(videoEnabled);
        this.screenShare$.next(false);
        this.streamTitle$.next(streamTitle);
    }

}

