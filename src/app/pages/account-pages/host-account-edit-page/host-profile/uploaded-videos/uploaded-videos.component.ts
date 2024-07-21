import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoService} from '../../../../../_core/services/videos.service';
import {VideoModel} from '../../../../../_core/model/video.model';
import {MatDialog} from '@angular/material/dialog';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ConfirmModalComponent} from '../../../../../@mvp/shared-components/confirm-modal/confirm-modal.component';

@Component({
    selector: 'app-uploaded-videos',
    templateUrl: './uploaded-videos.component.html',
    styleUrls: ['./uploaded-videos.component.scss']
})

export class UploadedVideosComponent implements OnInit {

    @Output()
    videoClicked = new EventEmitter<{ video: VideoModel, videos: VideoModel[] }>();

    private _roomId: string;
    @Input()
    set roomId(val) {
        this._roomId = val;
    }
    get roomId(): string {
        return this._roomId;
    }

    mostRecentVideos: VideoModel[];
    private _videos: VideoModel[];
    @Input()
    set videos(videos) {
        this.mostRecentVideos = videos.slice(0, 8);
        this._videos = videos;
    }
    get videos(): VideoModel[] {
        return this._videos;
    }

    constructor(public mob: DeviceDetectorService,
                private uploadedVideosService: VideoService,
                public dialog: MatDialog) {
    }

    ngOnInit(): void {
    }

    remove(video: VideoModel): void {
        const idx = this.videos.findIndex((f) => f.id === video.id);
        this.videos.splice(idx, 1);
        this.mostRecentVideos.splice(idx, 1);
        this.uploadedVideosService.deleteVideo(video.id).subscribe();
    }

    videoCardClicked($event: VideoModel): void {
        this.videoClicked.emit({video: $event, videos: this.videos});
    }

    openModalConfirmRemove(video: VideoModel): void {
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '500px',
            disableClose: true,
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
