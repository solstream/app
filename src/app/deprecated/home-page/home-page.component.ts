import {Component, OnInit} from '@angular/core';
import {ChannelsService} from '../../_core/services/channels.service';
import {VideoModel, VideoType2} from '../../_core/model/video.model';
import {DeviceDetectorService} from 'ngx-device-detector';
import {TrendingContentModel, TrendingContentService} from '../../_core/services/trending-content.service';
import {VideoCarouselInputModel} from '../../pages/home-page-v2/video-carousel/video-carousel.component';
import {VideoService} from '../../_core/services/videos.service';
import {AccountModel} from '../../_core/model/accountModel';
import {chains} from '../../tokens/tokenomics';
import {WalletAuthService} from '../../@mvp/login-popup/wallet-login/wallet-auth.service';

@Component({
    selector: 'app-main',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    ready = false;
    popsReady = false;
    videoCarouselInput: VideoCarouselInputModel = null;
    chains = chains;
    trendingContentInput: TrendingContentModel = null;
    channels: AccountModel[] = [];
    uploadedVideos: VideoModel[] = [];
    popsVideo: VideoCarouselInputModel = null;

    constructor(private roomsService: ChannelsService,
                private walletAuthService: WalletAuthService,
                private uploadedVideosService: VideoService,
                private trendingContentService: TrendingContentService,
                public mob: DeviceDetectorService) {
    }

    ngOnInit(): void {
        // this.getTrendingContent();
        // this.getChannels();
    }

    private getTrendingContent(): void {
        this.trendingContentService.getTrendingContent().subscribe((rez) => {
            rez.videos = rez.videos.filter(singleVideo => singleVideo.videoType !== VideoType2.POP);
            this.trendingContentInput = rez;
            this.getVideos();
            const videos = [...rez.videos].sort(() => .5 - Math.random());
            this.videoCarouselInput = {videos};
        });
    }

    private getChannels(): void {
        this.roomsService.getHomePageChannels().subscribe((rez) => {
            this.channels = rez;
        });
    }

    private getVideos(): void {
        this.uploadedVideosService.getAllPops().subscribe((rez) => {
            // Only premium pops in carousel
            // @ts-ignore
            this.popsVideo = {};
            this.popsVideo.videos = rez.filter(singleVideo => singleVideo.roomPremium);
            if (this.popsVideo.videos.length === 0) {
                this.popsVideo.videos = rez;

            }
            this.popsReady = true;
        });
        debugger
        this.uploadedVideosService.getRecentVideos().subscribe((rez) => {
            this.uploadedVideos = rez.filter(singleVideo => singleVideo.videoType !== VideoType2.POP).slice(0 , 12);
            // Only premium in carousel
            // @ts-ignore
            this.videoCarouselInput.videos = this.uploadedVideos.filter(singleVideo => singleVideo.roomPremium && singleVideo.videoType !== VideoType2.POP);

            this.ready = true;
        });
    }

    switchNetwork(chain) {
        this.walletAuthService.switchToNetwork(chain);
    }

}
