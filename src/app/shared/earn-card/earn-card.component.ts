import {Component, Input, OnInit} from '@angular/core';
import {EarnModel} from '../../_core/model/earn.model';
import * as Utils from 'src/app/_core/utils/utils';
import {CurrentUserState} from '../../_core/services/current-user-state.service';

@Component({
  selector: 'app-earn-card',
  templateUrl: './earn-card.component.html',
  styleUrls: ['./earn-card.component.scss']
})
export class EarnCardComponent implements OnInit {
  readonly solstreamToDollar = Utils.convertsolstreamToDollar;

  constructor(private cus: CurrentUserState) { }
  @Input() earnActivity: EarnModel;


  ngOnInit(): void {
  }

  triggerActivityMessage(): void {
    if (this.cus.isLoggedIn()) {
      if (this.earnActivity.link) {
        window.location.href = this.earnActivity.link;
      } else {
        alert('Activity non available yet.');
      }
    } else {
      alert('You have to login in order to join this activity.');
    }
  }
}
