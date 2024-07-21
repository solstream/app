import {Component, Input, OnInit} from '@angular/core';
import {VideoModel, VideoType2} from '../../_core/model/video.model';
import {RouterService} from '../../_core/services/router.service';
import {convertsolstreamToDollar} from '../../_core/utils/utils';

@Component({
    selector: 'app-preview-card',
    templateUrl: './preview-card.component.html',
    styleUrls: ['./preview-card.component.scss']
})
export class PreviewCardComponent implements OnInit {

    @Input() video: VideoModel;
    @Input() type: PreviewCardType = 'video';

    solstreamToDollar = convertsolstreamToDollar;
    backupImage = 'https://media.istockphoto.com/id/1309023728/it/video/introduzione-cinematografica-del-prossimo-prossimo-lettering-dal-buio.jpg?s=640x640&k=20&c=lbLp3tD9PP-ti6B_A1Ac_39NP8meUUwWFVr_GemD8JM=';

    constructor(private readonly routerService: RouterService) {
    }

    ngOnInit(): void {
        this.video.snapShotUrl = this.video.snapShotUrl || this.backupImage;
        this.video.roomAvatarUrl = this.video.roomAvatarUrl || '/assets/icons/login-btn.png';
    }

    cardClicked(): void {
        if (this.video.videoType === VideoType2.PODCAST_LIVE) {
            this.routerService.navigateToTheRoom(this.video.roomName);
            return;
        }
        this.routerService.navigateToTheRoomAutoPlayVideo(this.video.roomName, this.video.id);
    }

    // TODO use pipe
    secondsToHms(durationInSeconds: number): string {
        const h = Math.floor(durationInSeconds / 3600);
        const m = Math.floor((durationInSeconds % 3600) / 60);
        const s = Math.round(durationInSeconds % 60);
        return [
            h,
            m > 9 ? m : (h ? '0' + m : m || '0'),
            s > 9 ? s : '0' + s
        ].filter(Boolean).join(':');
    }

    popsCardClicked(video: VideoModel): void {
        this.routerService.navigateToPop(video.id);
    }
}

type PreviewCardType = 'video' | 'pops';
