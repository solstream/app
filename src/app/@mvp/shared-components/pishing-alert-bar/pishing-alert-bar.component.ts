import { Component, Inject, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LocalStorageService } from 'src/app/_core/services/auth-store.service';

@Component({
  selector: 'app-pishing-alert-bar',
  templateUrl: './pishing-alert-bar.component.html',
  styleUrls: ['./pishing-alert-bar.component.scss']
})
export class PishingAlertBarComponent implements OnInit {

  showPishingAlertBar = false;

  constructor(private authStore: LocalStorageService,
    public mob: DeviceDetectorService) { }

  ngOnInit(): void {
    this.showPishingAlertBar = this.authStore.getFlagPishingAlertBar() !== 'N';
  }

  hidePishingAlertBar(): void {
    this.authStore.setFlagShowPishingAlertBar('N');
    this.showPishingAlertBar = this.authStore.getFlagPishingAlertBar() === 'Y';
  }

}
