import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AccountModel} from '../../../../_core/model/accountModel';

export interface VideoPlayerInputData {
  url: string;
  room: AccountModel;
}

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
// TODO, NOT USED ANYMORE
export class VideoPlayerComponent implements OnInit {


  hidden = true;

  url = '';
  room: AccountModel;
  constructor(public dialogRef: MatDialogRef<VideoPlayerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: VideoPlayerInputData) {
    this.url = data.url;
    this.room = data.room;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.hidden = false;
    }, 1000);
  }

}
