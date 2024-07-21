import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-channel-icon',
  templateUrl: './channel-icon.component.html',
  styleUrls: ['./channel-icon.component.scss']
})
export class ChannelIconComponent implements OnInit {

  @Input()
  small = false;

  @Input()
  iconUrl: string;

  @Input()
  isPremium = false;

  constructor() { }

  ngOnInit(): void {
  }

}
