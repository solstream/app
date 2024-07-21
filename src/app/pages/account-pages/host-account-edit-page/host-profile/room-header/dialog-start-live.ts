import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {StreamingDialogData} from './room-header.component';

@Component({
    selector: 'app-dialog-live',
    templateUrl: 'dialog-live.html',
})
export class DialogStartLiveComponent {
    wrongStreamingCode = true;

    codeForm = new FormGroup({
        code: new FormControl(''),
    });

    constructor(
        public dialogRef: MatDialogRef<DialogStartLiveComponent>,
        @Inject(MAT_DIALOG_DATA) public data: StreamingDialogData) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

}
