import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoModel} from '../../../../../_core/model/video.model';
import {ChannelsService} from '../../../../../_core/services/channels.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ConfirmModalComponent} from '../../../../../@mvp/shared-components/confirm-modal/confirm-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {VideoService} from '../../../../../_core/services/videos.service';

@Component({
    selector: 'app-recent-podcasts',
    templateUrl: './recent-podcasts.component.html',
    styleUrls: ['./recent-podcasts.component.scss']
})
export class RecentPodcastsComponent implements OnInit {

    @Input()
    podcasts: VideoModel[] = [];

    @Output()
    videoClicked = new EventEmitter<{ video: VideoModel, videos: VideoModel[] }>();

    @Output()
    initialLoad = new EventEmitter<{ video: VideoModel, videos: VideoModel[] }>();

    private _roomId: string;

    @Input()
    set roomId(val: string) {
        this._roomId = val;
    }

    get roomId(): string {
        return this._roomId;
    }

    constructor(private service: VideoService,
                public dialog: MatDialog,
                public mob: DeviceDetectorService) {
    }

    ngOnInit(): void {
    }

    remove(video: VideoModel): void {
        const idx = this.podcasts.findIndex((f) => f.id === video.id);
        this.podcasts.splice(idx, 1);
        this.service.deleteVideo(video.id).subscribe();
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

    videoCardClicked($event: VideoModel): void {
        this.videoClicked.emit({video: $event, videos: this.podcasts});
    }

}
