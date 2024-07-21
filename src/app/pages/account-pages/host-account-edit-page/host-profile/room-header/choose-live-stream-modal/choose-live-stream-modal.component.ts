import {Component, Inject, OnInit} from '@angular/core';
import {RouterService} from '../../../../../../_core/services/router.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-choose-live-stream-modal',
  templateUrl: './choose-live-stream-modal.component.html',
  styleUrls: ['./choose-live-stream-modal.component.scss']
})
export class ChooseLiveStreamModalComponent implements OnInit {

  private roomId: string;
  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
      private routerService: RouterService
  ) { }

  ngOnInit(): void {
    this.roomId = this.data.roomId;
  }

  navigateTosolstreampace(): void {
    this.routerService.navigateToStartLive(this.roomId);
  }

  navigateToProfile(): void {
    this.routerService.navigateToEditProfile(this.roomId);
  }

}
