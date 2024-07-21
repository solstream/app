import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from '../../../../../_core/services/auth-store.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-signature-modal',
  templateUrl: './signature-modal.component.html',
  styleUrls: ['./signature-modal.component.scss']
})
export class SignatureModalComponent implements OnInit {

  constructor(
      private authStore: LocalStorageService, public mob: DeviceDetectorService, public dialogRef: MatDialogRef<SignatureModalComponent>
  ) { }

  ngOnInit(): void {
  }

  hideModal(): void {
    this.authStore.setFlagDemoDisclaimer('N');
    this.dialogRef.close();
  }
}
