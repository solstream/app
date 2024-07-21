import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Subscription} from 'rxjs';
import {VideoModel, VideoType2} from '../../_core/model/video.model';
import {SearchUiService} from './search-ui.service';
import {ActivatedRoute} from '@angular/router';
import {VideoSearchService} from '../../_core/services/video-search.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {RouterService} from '../../_core/services/router.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

    videos: VideoModel[] = [];
    subscription: Subscription;
    loading = true;
    topic: string;
    searchText: string;

    constructor(public mob: DeviceDetectorService,
                private routerService: RouterService,
                private videoSearchService: VideoSearchService,
                private activatedRoute: ActivatedRoute,
                private searchUiService: SearchUiService) {
    }

    ngOnInit(): void {
        this.subscription = combineLatest([this.activatedRoute.queryParams, this.searchUiService.getChange()]).subscribe(([topic, search]) => {
            this.topic = topic.key;
            this.searchText = search;
            this.searchVideo();
        });
    }

    private searchVideo(): void {
        this.videoSearchService.search(0, 50, this.searchText, this.topic).subscribe((rez) => {
            // TODO fix on BE side
            rez.content.forEach(v => v.title = v['videoTitle']);
            rez.content.forEach(v => v.time = v['createDate']);
            this.videos = rez.content;
            this.loading = false;
        });
    }

    videoCardClicked($event: VideoModel): void {
        if ($event.videoType === VideoType2.PODCAST_LIVE) {
            this.routerService.navigateToTheRoom($event.roomName);
        }
        this.routerService.navigateToTheRoomAutoPlayVideo($event.roomName, $event.id);
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
