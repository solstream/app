import {Component, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ActivatedRoute} from '@angular/router';
import {TopicsService} from '../../../pages/admin-pages/topics/topics.service';

@Component({
    selector: 'app-topics-menu',
    templateUrl: './topics-menu.component.html',
    styleUrls: ['./topics-menu.component.scss']
})
export class TopicsMenuComponent implements OnInit {

    topics: string[];

    constructor(public mob: DeviceDetectorService, private topicsService: TopicsService, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        // NOTE: topics are not fetched as at the moment not enough content for multiple topics
        // this.topicsService.getMainSearchTopics().subscribe((topics) => {
            // this.topics = topics.map(t => t.topicName);
        // });
    }

    isActive(key: string): boolean {
        if (key === 'all') {
            return this.activatedRoute.snapshot.queryParams.key === undefined;
        }
        return this.activatedRoute.snapshot.queryParams.key === key;
    }

    isInSearch(): boolean {
        return this.activatedRoute.snapshot.routeConfig.path === 'search';
    }

}
