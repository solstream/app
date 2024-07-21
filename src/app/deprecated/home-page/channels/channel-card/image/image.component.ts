import {Component, Input, OnInit} from '@angular/core';
import {ChannelsMode} from '../../channels.component';
import {AccountModel} from '../../../../../_core/model/accountModel';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input()
  room: AccountModel;

  @Input()
  mode: ChannelsMode = 'channel-list';

  hostMode = false;

  constructor() { }

  ngOnInit(): void {
  }

  getBackgroundImageUrl(): string {
    if (this.mode === 'podcast-list') {
      return `url(${this.room.streamSnapshotUrl})`;
    }
    if (this.hasBackground()) {
      return `url(${this.room.backgroundUrl})`;
    }
    return 'url(assets/newgi.png)';
  }

  getBackgroundSize(): string {
    if (!this.hasBackground()) {
      return '65%';
    }
    return 'none';
  }

  hasBackground(): boolean {
    if (this.mode === 'channel-list' || this.mode === 'admin') {
      return Boolean(this.room?.backgroundUrl) ;
    }
    return true ;
  }
}
