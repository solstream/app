import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {VideoModel} from '../../../_core/model/video.model';

@Injectable({
    providedIn: 'root'
})
export class MessageComponentState {

    joinRoom = new BehaviorSubject<RoomConference>(null);
    leavingRoom = new BehaviorSubject<string>(null);
    currentLiveStream$ = new Subject<RoomConference>();

    constructor() {
    }

    enterRoom(): Observable<RoomConference> {
        return this.joinRoom.pipe(filter(X => X !== null));
    }

    getRoomLeaving(roomName: string): Observable<string> {
        return this.leavingRoom.pipe(filter(X => X !== null), filter(s => s === roomName));
    }
}

export interface RoomConference {
    roomName: string;
    confId: string;
    liveAccountId: string;
    connectedUserAccountId: string;
}
