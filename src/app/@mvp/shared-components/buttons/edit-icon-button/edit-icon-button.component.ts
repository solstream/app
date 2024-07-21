import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {faPen} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-icon-button',
  templateUrl: './edit-icon-button.component.html',
  styleUrls: ['./edit-icon-button.component.scss']
})
export class EditIconButtonComponent implements OnInit {

  iconEdit = faPen;

  @Output()
  buttonClicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
