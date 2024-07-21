import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-delete-icon-button',
  templateUrl: './delete-icon-button.component.html',
  styleUrls: ['./delete-icon-button.component.scss']
})
export class DeleteIconButtonComponent implements OnInit {

  trashIco = faTrashAlt;

  @Output()
  buttonClicked = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onClick(e: Event): void {
    e.stopPropagation();
    this.buttonClicked.emit();
  }

}
