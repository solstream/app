import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { LocalStorageService } from 'src/app/_core/services/auth-store.service';

@Component({
  selector: 'app-cookies-bar-modal',
  templateUrl: './cookies-bar-modal.component.html',
  styleUrls: ['./cookies-bar-modal.component.scss']
})
export class CookiesBarModalComponent implements OnInit {

  constructor(private authStore: LocalStorageService,
    public mob: DeviceDetectorService,
    public dialogRef: MatDialogRef<CookiesBarModalComponent>,) { }

  ngOnInit(): void {
  }

  hideCookiesBar(): void {
    this.authStore.setFlagShowCookiesBar('N');
    this.dialogRef.close();
  }

}
