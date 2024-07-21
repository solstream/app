import { Component, OnInit } from '@angular/core';
import {LocalStorageService} from '../../../_core/services/auth-store.service';
import {MatDialog} from '@angular/material/dialog';
import {DemoDisclModalComponent} from './demo-modal/demo-discl-modal/demo-discl-modal.component';

@Component({
  selector: 'app-demo-disclaimer',
  templateUrl: './demo-disclaimer.component.html',
  styleUrls: ['./demo-disclaimer.component.scss']
})
export class DemoDisclaimerComponent implements OnInit {
  showDemoDisclaimer = false;
  dialogRef;

  constructor(private authStore: LocalStorageService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.showDemoDisclaimer = this.authStore.getFlagDemoDisclaimer() !== 'N';
    if ( this.showDemoDisclaimer) {
      this.openCookiesBarModal();
    }
  }

  hideCookiesBar(): void {
    this.authStore.setFlagDemoDisclaimer('N');
    this.showDemoDisclaimer = this.authStore.getFlagDemoDisclaimer() === 'Y';
  }

  openCookiesBarModal() : void {
    this.dialogRef = this.dialog.open(DemoDisclModalComponent, {
      width: '650px'
    });
  }

}
