import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AccountModel} from '../../../../_core/model/accountModel';

@Component({
  selector: 'app-channel-side-bar-list-item',
  templateUrl: './channel-side-bar-list-item.component.html',
  styleUrls: ['./channel-side-bar-list-item.component.scss']
})
export class ChannelSideBarListItemComponent {

  @Input()
  isCollapsed: boolean;
  @Input()
  selected = false;
  @Input()
  channel: AccountModel;
  @Output()
  itemClicked = new EventEmitter<AccountModel>();


}
