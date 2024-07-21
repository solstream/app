import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountModel} from '../../../../_core/model/accountModel';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {MatDialog} from '@angular/material/dialog';
import {ImageCropDialogComponent} from './image-crop-dialog/image-crop-dialog.component';
import {combineLatest, forkJoin} from 'rxjs';
import {VideoModel, VideoType2} from '../../../../_core/model/video.model';
import {LocalStorageService} from '../../../../_core/services/auth-store.service';
import {VideoService} from '../../../../_core/services/videos.service';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';
import {ChannelsService} from '../../../../_core/services/channels.service';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
    selector: 'app-host-profile',
    templateUrl: './host-profile.component.html',
    styleUrls: ['./host-profile.component.scss']
})
export class HostProfileComponent implements OnInit {
    videoReady = false;
    ready = true;
    open = false;
    iconEdit = faPen;
    uploadingBackgroundImage = false;
    videoFileUrl: string;
    loadingNewVideo = false;

    recentPodcasts: VideoModel[] = [];
    uploadedVideos: VideoModel[] = [];
    uploadedPops: VideoModel[] = [];

    hostMode = true;
    _hostRoom: AccountModel;

    @Input()
    set hostRoom(val: AccountModel) {
        this._hostRoom = val;
        this.videoReady = false;
        if (val) {
            this.fetchData();
        }
    }

    get hostRoom(): AccountModel {
        return this._hostRoom;
    }

    @Output() hostRoomChange = new EventEmitter();

    @ViewChild('container', {static: false})
    container: ElementRef;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private authStore: LocalStorageService,
                public videoService: VideoService,
                private us: CurrentUserState,
                public dialog: MatDialog,
                public device: DeviceDetectorService,
                private service: ChannelsService) {
    }

    ngOnInit(): void {
    }

    private fetchData(): any {
        forkJoin([
            this.videoService.getUploadedVideos(this._hostRoom.id, true),
            this.videoService.getAllPops(),
            this.videoService.getLiveRecords(this._hostRoom.id)])
            .subscribe(([video, pop, liveRecord]) => {
                this.uploadedVideos = video;
                localStorage.setItem('upv', video.length.toString());
                this.uploadedPops = pop.filter(room => room.roomId === this._hostRoom.id);
                this.recentPodcasts = liveRecord;
            });
    }

    private showBackgroundImageCropper(imageChangeEvent): void {
        const dialogRef = this.dialog.open(ImageCropDialogComponent, {data: {imageChangeEvent}});
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.uploadingBackgroundImage = true;
                this.hostRoom.backgroundUrl = null;
                this.service.saveBackgroundImageIpfs(this.hostRoom.id, result).subscribe((room) => {
                    this._hostRoom = room;
                    this.uploadingBackgroundImage = false;
                });
            }
        });
    }

    videoUploaded(): void {
        this.fetchData();
    }

    uploadBackground($event): void {
        this.showBackgroundImageCropper($event);
    }

    showVideo(video: VideoModel): void {
        this.videoFileUrl = null;
        this.loadingNewVideo = true;
        setTimeout(() => {
            this.videoReady = true;
            this.videoFileUrl = video.videoFileUrl;
            this.loadingNewVideo = false;
        }, 50);

    }

    isAdmin(): boolean {
        return this.us.isAdmin();
    }

    getBackgroundImageUrl(): string {
        return `url(${this.hostRoom.backgroundUrl || 'https://www.solstream.io/wp-content/uploads/2024/03/Screenshot-2024-03-08-at-07.43.04-2048x974.png'})`;
    }


}
