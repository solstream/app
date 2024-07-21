import {Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import { height } from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import { ShareModalComponent } from './share-modal/share-modal.component';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  @Input() videoUrl;

  isMobile = false;

  constructor(public dialog: MatDialog, private device: DeviceDetectorService) {
    this.isMobile = device.isMobile();
  }
  shareVisible = false;
  ngOnInit(): void {
  }

  share(): void {
    // this.shareVisible = !this.shareVisible;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = this.isMobile ? '50%' : '580px';
    dialogConfig.height = this.isMobile ? '40%' : '265px';
    dialogConfig.data = { isMobile: !!this.isMobile, videoUrl: this.videoUrl };

    const dialogRef = this.dialog.open(ShareModalComponent, dialogConfig );
}
}
