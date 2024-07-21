import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {faTimesCircle} from '@fortawesome/free-solid-svg-icons';

export interface MessageDialogData {
  message: string;
}

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {
  warningIco = faTimesCircle;
  message = '';
  constructor( public dialogRef: MatDialogRef<MessageDialogComponent>,
               @Inject(MAT_DIALOG_DATA) public data: MessageDialogData) {
    this.message = data.message;
  }

  ngOnInit(): void {
  }

}
