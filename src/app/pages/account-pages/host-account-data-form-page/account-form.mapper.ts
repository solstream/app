import {Injectable} from '@angular/core';
import {AccountModel} from '../../../_core/model/accountModel';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Constants} from '../../../_core/constants/constants';

@Injectable({
    providedIn: 'root'
})
export class AccountFormMapper {
    constructor() {
    }

    createEmptyForm(walletEditable = false): FormGroup {
        return this.createRoomForm(null, walletEditable);
    }

    createRoomForm(room: AccountModel = null, walletEditable = false): FormGroup {
        return new FormGroup({
            roomName: new FormControl(room?.roomName,
                [Validators.required, Validators.minLength(5), Validators.pattern(Constants.NO_WHITE_SPACE_REGEX_PATTERN)]),
            roomTitle: new FormControl(room?.roomTitle, [Validators.required]), // not displayed,
            roomTopic: new FormControl('Gaming', [Validators.required]),
            bioText: new FormControl(room?.bioText, [Validators.required]),
            streamTitle: new FormControl(room?.streamTitle, [Validators.required]),
            id: new FormControl(room?.id),
            qrCode: new FormControl({value: room?.qrCode, disabled: !walletEditable}),
            streamKey: new FormControl({value: room?.streamKey, disabled: true}),
        });
    }
}
