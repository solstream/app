import { Component, Inject, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.scss']
})
export class ShareModalComponent implements OnInit {

  public embedString: string;

  constructor(
      public dialogRef: MatDialogRef<ShareModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { isMobile: boolean; videoUrl: string},
      public snackBar: MatSnackBar
  ) {
    
   }

  ngOnInit(): void {
    this.embedString = `<video controls width="560" height="315" src="${this.data.videoUrl}"></video>`;
  }

  hideModal(): void {
    this.dialogRef.close({event:'close'});
  }

  copyEmbedUrl(embedString: string): void {
    navigator.clipboard.writeText(embedString);
    this.snackBar.open('COPIED TO CLIPBOARD', 'close', { duration: 3000 });
  }

}
