import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FileValidators} from 'ngx-file-drag-drop';
import {FormControl} from '@angular/forms';
import {Constants} from '../../../../../../_core/constants/constants';
import {VideoService} from '../../../../../../_core/services/videos.service';
import {Observable, Subject} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';
import {AzureUploadService} from '../../../../../../_core/services/azure-upload.service';
import {mergeMap} from 'rxjs/operators';
import {VideoUtils} from '../../../../../../_core/utils/video-utils.service';
import {NewVideoUploadRestrictions, VideoModel} from '../../../../../../_core/model/video.model';
import {HttpEventType} from '@angular/common/http';

@Component({
    selector: 'app-upload-video-modal',
    templateUrl: './upload-video-modal.component.html',
    styleUrls: ['./upload-video-modal.component.scss']
})
export class UploadVideoModalComponent implements OnInit {

    videoUploadRestrictions: NewVideoUploadRestrictions;
    snapshotUrl: any;
    apiError: string;
    fileValidationError: string;
    uploadProgressPercentage = new Subject<number>();
    roomId: string;
    titleControl = new FormControl([], [FileValidators.required]);
    uploadingInProgress = false;

    videoFileToUpload: File = null;
    spanShotFile: File = null;
    selectedVideoDuration: number;

    constructor(
        private azureUploadService: AzureUploadService,
        private sanitizer: DomSanitizer,
        private videoService: VideoService,
        private videoUtils: VideoUtils,
        private dialogRef: MatDialogRef<UploadVideoModalComponent>,
        @Inject(MAT_DIALOG_DATA) private data,
    ) {
    }

    ngOnInit(): void {
        this.dialogRef.disableClose = true;
        this.roomId = this.data.roomId;
        this.videoService.canUploadVideo().subscribe(restrictions => {
            this.videoUploadRestrictions = restrictions;
        });
    }

    snapShotSelected(snapshot: File): void {
        this.spanShotFile = snapshot;
        if (snapshot) {
            const objectUrl = URL.createObjectURL(snapshot);
            this.snapshotUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        }
    }

    private validateFile(file: File): boolean {
        this.fileValidationError = null;
        if (!file) {
            return;
        }
        // we upload only to ipfs
        // if (file.size >= this.getMaxVideoFileSize()) {
        if (this.fileLimitExceedsIpfs(file)) {
            this.fileValidationError = 'File size exceeds the allowable limit.';
            this.videoFileToUpload = null;
            return false;
        }
        const fileType = file.name.split('.').pop().toUpperCase();
        if (!Constants.VALID_VIDEO_FILE_EXTENSIONS.includes(fileType)) {
            this.fileValidationError = 'You have attempted to upload an invalid file type.';
            this.videoFileToUpload = null;
            return false;
        }
        return true;
    }

    private getMaxVideoFileSize(): number {
        if (this.videoUploadRestrictions.maxSize > -1) {
            return this.videoUploadRestrictions.maxSize * 1000000;
        }
        return Constants.FILE_MAX_VIDEO_SIZE_BYTES;
    }

    onFileSelected(file: File[]): void {
        if (file.length === 0) {
            this.videoFileToUpload = null;
        }
        if (this.validateFile(file[0])) {
            this.videoFileToUpload = file[0];
            this.getVideoDuration(file[0]).subscribe((duration) => {
                this.selectedVideoDuration = duration;
            });
        }

    }

    uploadVideoFile(): void {
        const file: File = this.videoFileToUpload;
        this.uploadingInProgress = true;
        this.videoUtils.isPop(file).pipe(
            mergeMap((isPop) => this.videoService.createVideoWithoutFile(this.roomId, this.titleControl.value, isPop, this.selectedVideoDuration)),
        ).subscribe((video) => {
            this.videoService.uploadSnapshotIpfs(this.roomId, video.id, this.spanShotFile).subscribe((imageUploadResponse) => {
                const iconUrl = imageUploadResponse.path;
                this.videoService.uploadVideoToIpfs(file).subscribe((rez) => {
                    if (rez.type === HttpEventType.UploadProgress) {
                        const percentDone = Math.round((rez.loaded * 100) / rez.total);
                        this.uploadProgressPercentage.next(percentDone);
                        return;
                    }
                    if (rez.body) {
                        this.videoService.completeUploadIpfs(video.id, rez.body.path, iconUrl).subscribe(() => {
                            this.dialogRef.close('done');
                        });
                    }
                });
            });
        });
    }

    private fileLimitExceedsIpfs(file: File): boolean {
        return file.size > Constants.FILE_MAX_IPFS_SIZE_BYTES;
    }

    getVideoDuration(file: File): Observable<number> {
        const response = new Subject<number>();
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            window.URL.revokeObjectURL(video.src);
            response.next(video.duration);
            response.complete();
            video.remove();
        };
        video.src = URL.createObjectURL(file);
        return response;
    }

    hideModal(): void {
        this.dialogRef.close('cancel');
    }
}

export type UploadResult = 'done' | 'canceled';
