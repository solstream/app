import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LocalStorageService } from 'src/app/_core/services/auth-store.service';
import { CookiesBarModalComponent } from './cookies-bar-modal/cookies-bar-modal.component';

@Component({
  selector: 'app-cookies-bar',
  templateUrl: './cookies-bar.component.html',
  styleUrls: ['./cookies-bar.component.scss']
})
export class CookiesBarComponent implements OnInit {

  showCookiesBar = false;
  dialogRef;

  constructor(private authStore: LocalStorageService,
    public mob: DeviceDetectorService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.showCookiesBar = this.authStore.getFlagShowCookiesBar() !== 'N';
    // if (this.mob.isMobile() && this.showCookiesBar)
    //   this.openCookiesBarModal();
  }

  hideCookiesBar(): void {
    this.authStore.setFlagShowCookiesBar('N');
    this.showCookiesBar = this.authStore.getFlagShowCookiesBar() === 'Y';
  }

  openCookiesBarModal() : void {
    this.dialogRef = this.dialog.open(CookiesBarModalComponent, {
      width: '650px'
  });
  }

}
