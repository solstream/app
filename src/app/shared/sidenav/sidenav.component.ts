import {Component, Input, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ChannelContentService} from '../../_core/services/channel-content.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {AccountModel} from '../../_core/model/accountModel';
import {CurrentUserState} from '../../_core/services/current-user-state.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Input() isHomePage = false;

  isCollapsed = false;
  isSmallScreen;
  isMobile = false;
  channels: AccountModel[];

  constructor(
      private mob: DeviceDetectorService,
      private cus: CurrentUserState,
      public landingRoomsService: ChannelContentService,
      private observer: BreakpointObserver) {
        this.isMobile = mob.isMobile();
  }

  ngOnInit(): void {
    this.observer.observe('(max-width: 1200px)').subscribe(result => {
      this.isCollapsed = this.isHomePage || result.matches;
    });
  }

  public collapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
