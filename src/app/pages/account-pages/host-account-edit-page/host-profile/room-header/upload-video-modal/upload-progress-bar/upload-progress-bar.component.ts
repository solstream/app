import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import {ProgressBarMode} from '@angular/material/progress-bar/progress-bar';

export interface DialogData {
    percent: Subject<number>;
    processed: Subject<boolean>;
}

@Component({
    selector: 'app-upload-progress-bar',
    templateUrl: './upload-progress-bar.component.html',
    styleUrls: ['./upload-progress-bar.component.scss']
})
export class UploadProgressBarComponent implements OnInit, OnDestroy {
    @Input() uploadPercentSubject: Subject<number>;

    mode: ProgressBarMode = 'determinate';
    percent = 0;

    ngOnInit(): void {
        this.uploadPercentSubject.subscribe((val: number) => {
            this.percent = val;
            if (val === 100) {
                this.mode = 'indeterminate';
            }
        });

    }

    ngOnDestroy(): void {
        // TO DO init fire only one time;
        // this.percentSubject.unsubscribe();
        // this.processedSubject.unsubscribe();
    }
}
