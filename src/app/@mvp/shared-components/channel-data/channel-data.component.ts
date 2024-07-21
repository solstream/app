import {Component, Input, OnInit} from '@angular/core';
import {AccountModel} from '../../../_core/model/accountModel';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-channel-data',
  templateUrl: './channel-data.component.html',
  styleUrls: ['./channel-data.component.scss']
})
export class ChannelDataComponent implements OnInit {

  @Input()
  room: AccountModel;

  constructor(public device: DeviceDetectorService) { }

  ngOnInit(): void {
  }

}
