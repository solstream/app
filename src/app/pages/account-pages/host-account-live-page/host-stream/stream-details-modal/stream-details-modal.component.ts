import {Component, Inject, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../host-account-edit-page/host-profile/room-header/upload-video-modal/upload-progress-bar/upload-progress-bar.component';
import {StreamerContextState} from '../../stream-context-state.service';

@Component({
    selector: 'app-stream-details-modal',
    templateUrl: './stream-details-modal.component.html',
    styles: [
        `.mat-slide-toggle {
            display: block;
        }`
    ]
})
export class StreamDetailsModalComponent implements OnInit {

    titleControl = new FormControl();
    inviteControl = new FormControl(true);
    videoControl = new FormControl(true);

    constructor(public dialogRef: MatDialogRef<StreamDetailsModalComponent>,
                private scx: StreamerContextState,
                @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit(): void {
    }

    recordValue(value): void {
        this.scx.recordStream$.next(value.checked);
    }

    onStartStream(): void {
        this.dialogRef.close({title: this.titleControl.value, videoEnabled: this.videoControl.value, inviteEnabled: this.inviteControl.value });
    }

    cancel(): void {
        this.dialogRef.close({cancel: true});
    }

}
