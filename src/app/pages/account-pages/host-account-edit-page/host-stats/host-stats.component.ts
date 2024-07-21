import {Component, Input, OnInit} from '@angular/core';
import {AccountModel} from '../../../../_core/model/accountModel';

@Component({
  selector: 'app-host-stats',
  templateUrl: './host-stats.component.html',
  styleUrls: ['./host-stats.component.scss']
})
export class HostStatsComponent implements OnInit {

  @Input()
  room: AccountModel;

  constructor() { }

  ngOnInit(): void {
  }

}
