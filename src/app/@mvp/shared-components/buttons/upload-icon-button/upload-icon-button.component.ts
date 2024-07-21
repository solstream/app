import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {faPen} from '@fortawesome/free-solid-svg-icons';
import {faUpload} from '@fortawesome/free-solid-svg-icons/faUpload';
import {faCloudUploadAlt} from '@fortawesome/free-solid-svg-icons/faCloudUploadAlt';

@Component({
  selector: 'app-upload-icon-button',
  templateUrl: './upload-icon-button.component.html',
  styleUrls: ['./upload-icon-button.component.scss']
})
export class UploadIconButtonComponent implements OnInit {

  iconUpload = faCloudUploadAlt;

  @Output()
  buttonClicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }
}
