import {Component, Input, OnInit} from '@angular/core';
import {RouterService} from '../../../../_core/services/router.service';
import {CurrentUserState} from '../../../../_core/services/current-user-state.service';
import {ChannelsService} from '../../../../_core/services/channels.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-admin-premium-profile',
  templateUrl: './admin-premium-profile.component.html',
  styleUrls: ['./admin-premium-profile.component.scss']
})
export class AdminPremiumProfileComponent implements OnInit {

  @Input()
  roomId: string;

  disabled = true;

  isPremium = false;

  constructor(private routerService: RouterService, private roomService: ChannelsService, private cus: CurrentUserState) {
  }

  ngOnInit(): void {
    if (this.shouldBeDisplayed()) {
      this.roomService.isPremium(this.roomId).subscribe(premium => {
        this.isPremium = premium;
        this.disabled = false;
      });
    }
  }

  change(val: MatSlideToggleChange): void {
    this.disabled = true;
    this.roomService.setPremium(this.roomId, val.checked).subscribe(() => {
      this.disabled = false;
    });
  }

  shouldBeDisplayed(): boolean {
    return this.cus.isAdmin();
  }

}
