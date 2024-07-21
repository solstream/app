import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {faPlay, faPlayCircle, faTrashAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-play-icon-button',
  templateUrl: './play-icon-button.component.html',
  styleUrls: ['./play-icon-button.component.scss']
})
export class PlayIconButtonComponent implements OnInit {

  trashIco = faPlay;

  @Output()
  buttonClicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
