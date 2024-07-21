import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {faTrashAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nft-icon-button',
  templateUrl: './nft-icon-button.component.html',
  styleUrls: ['./nft-icon-button.component.scss']
})
export class NFTIconButtonComponent implements OnInit {

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
