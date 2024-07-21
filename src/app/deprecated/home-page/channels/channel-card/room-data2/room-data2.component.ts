import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AccountModel} from '../../../../../_core/model/accountModel';
import {RouterService} from '../../../../../_core/services/router.service';

@Component({
  selector: 'app-room-data2',
  templateUrl: './room-data2.component.html',
  styleUrls: ['./room-data2.component.scss']
})
export class RoomData2Component implements OnInit {

  @Input()
  room: AccountModel;

  @Input()
  showLiveStatus = true;

  @Input()
  enableNavigation = false;

  @Input()
  carousel = false;

  constructor(private routerService: RouterService) { }

  ngOnInit(): void {
  }

  goToChannel(): void {
      // this.router.navigate([`home/${this.room.roomName}`]);
  }

  goToRoom(): void {
    this.routerService.navigateToTheRoom(this.room.roomName);
  }

}
