import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-video-item',
    templateUrl: './video-item.component.html',
    styleUrls: ['./video-item.component.scss']
})
export class VideoItemComponent {

    @Input()
    selected = true;
    @Input()
    carouselVideoItemId: string;
    @Input()
    pictureUrl: string;
    @Output()
    itemClicked = new EventEmitter<string>();

    constructor() {
    }

    getBackgroundImageUrl(): string {
        return `url(${this.pictureUrl})`;
    }

    cardClicked(): void {
        this.itemClicked.emit(this.carouselVideoItemId);
    }

}
