import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  confirmMessage: String = 'are you sure to confirm this operation?'

  constructor(
      public dialogRef: MatDialogRef<ConfirmModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {confirmMsg: String}
  ) {
    this.confirmMessage = data.confirmMsg || this.confirmMessage;
   }

  ngOnInit(): void {
  }

  hideModal(): void {
    this.dialogRef.close({event:'close'});
  }

  confirm() : void {
    this.dialogRef.close({event:'confirm'});
  }

}
