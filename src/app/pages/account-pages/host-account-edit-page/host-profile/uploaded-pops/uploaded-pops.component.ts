import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoService} from '../../../../../_core/services/videos.service';
import {Subject} from 'rxjs';
import {VideoModel} from '../../../../../_core/model/video.model';
import {MatDialog} from '@angular/material/dialog';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ConfirmModalComponent} from '../../../../../@mvp/shared-components/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-uploaded-pops',
    templateUrl: './uploaded-pops.component.html',
    styleUrls: ['./uploaded-pops.component.scss']
})

export class UploadedPopsComponent implements OnInit {

    @Output()
    videoClicked = new EventEmitter<{ video: VideoModel, videos: VideoModel[] }>();

    private _roomId: string;
    private _videos: VideoModel[];

    @Input()
    set roomId(val) {
        this._roomId = val;
    }

    get roomId(): string {
        return this._roomId;
    }

    @Input()
    set videos(val) {
        this.lastVideos = val.slice(0, 8);
        this._videos = val.slice(8);

    }
    get videos(): VideoModel[] {
        return this._videos;
    }

    lastVideos: VideoModel[] = [];
    uploadProcessedSubject = new Subject();

    constructor(public mob: DeviceDetectorService,
                private uploadedVideosService: VideoService,
                public dialog: MatDialog) {
    }

    ngOnInit(): void {
    }

    remove(video: VideoModel): void {
        const idx = this.videos.findIndex((f) => f.id === video.id);
        this.videos.splice(idx, 1);
        const idx1 = this.lastVideos.findIndex((f) => f.id === video.id);
        this.lastVideos.splice(idx1, 1);
        this.uploadedVideosService.deleteVideo(video.id).subscribe();
    }

    videoCardClicked($event: VideoModel): void {
        this.videoClicked.emit({video: $event, videos: this.videos});
    }

    openModalConfirmRemove(video: VideoModel): void {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '500px',
            data : {
                confirmMsg: 'Are you sure to delete the video? The action will be permanent.'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result?.event === 'confirm') {
                this.remove(video);
            }
        });
    }
}
