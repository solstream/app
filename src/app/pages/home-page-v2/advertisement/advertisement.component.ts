import { Component, OnInit } from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.scss']
})
export class AdvertisementComponent implements OnInit {

  constructor(public mob: DeviceDetectorService) { }

  ngOnInit(): void {
  }

}
