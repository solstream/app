import {Injectable} from '@angular/core';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import {LocalStorageService} from './auth-store.service';
import {CurrentUserState} from './current-user-state.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class StreamViewService {

    showAudioControls = new BehaviorSubject<boolean>(false);

    constructor(private authStore: LocalStorageService,
                private cus: CurrentUserState) {
    }

    createSessionForUser(userName: string): any {
        const customerKey = VoxeetSDK.session.customerKey;
        const avatarUrl = this.cus.currentUserAccount$.value.avatarAzureUrl;

        if (!customerKey) {
            VoxeetSDK.initialize(this.authStore.getDolbyKey(), this.authStore.getDolbySecret());
            return VoxeetSDK.session.open({name: userName, avatarUrl});
        }
        return Promise.resolve();
    }


}
