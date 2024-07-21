import {Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {VideoModel} from '../../../../../_core/model/video.model';
import {DeviceDetectorService} from 'ngx-device-detector';
import {LocalStorageService} from '../../../../../_core/services/auth-store.service';
import {StreamViewService} from '../../../../../_core/services/stream-view.service';
import {AccountModel} from '../../../../../_core/model/accountModel';

@Component({
    selector: 'app-video-stream',
    templateUrl: './video-stream.component.html',
    styleUrls: ['./video-stream.component.scss']
})
export class VideoStreamComponent implements OnInit {

    liveVideo: VideoModel;
    isInTheRoom = false;
    userName: string;
    index = 0;
    isMob = false;

    @Input()
    currentVideoRoom: AccountModel;

    @Output()
    conferenceEnded = new EventEmitter();

    constructor(
        public mob: DeviceDetectorService,
        private authStore: LocalStorageService,
        private renderer: Renderer2,
        private streamViewService: StreamViewService) {
        this.isMob = this.mob.isMobile();
    }

    ngOnInit(): void {
    }

    showStream(roomName: string): boolean {
        return this.liveVideo?.roomName === roomName;
    }



}
