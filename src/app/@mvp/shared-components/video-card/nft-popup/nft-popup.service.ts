import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NFTPopupService {

    public modalNFT$ = new Subject<any>();

    constructor() {}

    openModal(step: NFTPopupState.OPEN, video): void {
        const mintData = {
            step, video
        };
        this.modalNFT$.next(mintData);
    }

    closeModal(): void {
        this.modalNFT$.next({
            step: NFTPopupState.CLOSE
        });
    }
}

export enum NFTPopupState {
    OPEN= 'open',
    CLOSE = 'close'
}

export enum NFTPopupStep {
    WELCOME = 'welcome',
}
