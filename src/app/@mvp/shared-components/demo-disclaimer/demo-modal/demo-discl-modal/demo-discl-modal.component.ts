import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from '../../../../../_core/services/auth-store.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-demo-discl-modal',
  templateUrl: './demo-discl-modal.component.html',
  styleUrls: ['./demo-discl-modal.component.scss']
})
export class DemoDisclModalComponent implements OnInit {

  constructor(
      private authStore: LocalStorageService, public mob: DeviceDetectorService, public dialogRef: MatDialogRef<DemoDisclModalComponent>
  ) { }

  ngOnInit(): void {
  }

  hideModal(): void {
    this.authStore.setFlagDemoDisclaimer('N');
    this.dialogRef.close();
  }

}
