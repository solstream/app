import {Component, Input} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {AccountModel} from '../../../_core/model/accountModel';

@Component({
  selector: 'app-main-channels',
  templateUrl: './channels.component.html',
  styleUrls: ['./channels.component.scss']
})
export class ChannelsComponent {

  @Input()
  mode: ChannelsMode = 'channel-list';

  @Input()
  hostMode = false;

  @Input()
  title: string;

  @Input()
  iconUrl: string;

  @Input()
  rooms: AccountModel[];

  constructor(public mob: DeviceDetectorService) { }

}

export type ChannelsMode = 'channel-list' | 'podcast-list' | 'admin';
