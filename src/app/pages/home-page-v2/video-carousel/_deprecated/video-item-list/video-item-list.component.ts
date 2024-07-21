import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'app-video-item-list',
  templateUrl: './video-item-list.component.html',
  styleUrls: ['./video-item-list.component.scss']
})
export class VideoItemListComponent implements OnInit {

  constructor() { }

  @Input()
  selectedItemId: string;

  @Output()
  itemClicked = new EventEmitter<string>();

  @Input()
  items: CarouselModel[];

  ngOnInit(): void {
  }

  isVideoItemSelected(item: CarouselModel): boolean {
    return this.selectedItemId === item.id;
  }

  videoItemClicked1(id: string): void {
    this.itemClicked.next(id);
  }

}

export class CarouselModel {
  id: string;
  snapShotUrl: string;
}
