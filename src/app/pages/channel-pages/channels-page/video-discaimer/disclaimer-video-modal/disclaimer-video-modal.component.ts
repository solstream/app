import { Component, OnInit } from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDialogRef} from '@angular/material/dialog';
import { LocalStorageService } from 'src/app/_core/services/auth-store.service';

@Component({
  selector: 'app-disclaimer-video-modal',
  templateUrl: './disclaimer-video-modal.component.html',
  styleUrls: ['./disclaimer-video-modal.component.scss']
})
export class DisclaimerVideoModal implements OnInit {

  constructor(
      private authStore: LocalStorageService, public mob: DeviceDetectorService, public dialogRef: MatDialogRef<DisclaimerVideoModal>
  ) { }

  ngOnInit(): void {
  }

  hideModal(): void {
    this.authStore.setFlagVideoDisclaimer('N');
    this.dialogRef.close();
  }

}
