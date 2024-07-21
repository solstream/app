import {Component, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ChannelContentService} from '../../../_core/services/channel-content.service';
import {map} from 'rxjs/operators';
import {VideoModel} from '../../../_core/model/video.model';
import {TrendingContentModel} from '../../../_core/services/trending-content.service';
import {AccountModel} from '../../../_core/model/accountModel';
import {LocalStorageService} from '../../../_core/services/auth-store.service';
import {BreakpointObserver} from '@angular/cdk/layout';

@Component({
    selector: 'app-channels-page',
    templateUrl: './channels-page.component.html',
    styleUrls: ['./channels-page.component.scss']
})
export class ChannelsPageComponent implements OnInit {

    isCollapsed = false;
    isSmallScreen;
    hideToggle = false;
    isMobile = false;
    channels: AccountModel[];
    otherContent: TrendingContentModel;
    showSignUpBar = false;

    podcastsAndVideos: VideoModel[] = [];

    constructor(
        private mob: DeviceDetectorService,
        private authStore: LocalStorageService,
        public landingRoomsService: ChannelContentService,
        private breakPoint: BreakpointObserver) {
        this.isMobile = mob.isMobile();
    }

    ngOnInit(): void {
        this.breakPoint.observe('(max-width: 1200px)').subscribe(result => {
            if (!this.showSignUpBar) {
                this.isCollapsed = result.matches;
                this.hideToggle = !result.matches;
            }
        });
        this.landingRoomsService.getSideBarChannelsList().subscribe(rooms => {
            this.channels = rooms;
        });
        const userName = this.authStore.getSecurityUserName();
        this.showSignUpBar = !userName;
        this.landingRoomsService.getOtherContentVideos().pipe(map((rez) => {
            this.podcastsAndVideos = [...rez.videos].sort(() => .5 - Math.random());
            return rez;
        })).subscribe(rez => {
            this.otherContent = rez;
        });
    }

    collapse(): void {
        this.isCollapsed = !this.isCollapsed;
    }

}
