import { Component, OnInit } from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-next-events',
  templateUrl: './next-events.component.html',
  styleUrls: ['./next-events.component.scss']
})
export class NextEventsComponent implements OnInit {

  constructor(public mob: DeviceDetectorService) { }

  ngOnInit(): void {
  }

}
