import {Component, Input, OnInit} from '@angular/core';
import { HowToEarnCardModel } from 'src/app/_core/model/how-to-earn-card.model';

@Component({
  selector: 'app-reward-card',
  templateUrl: './reward-card.component.html',
  styleUrls: ['./reward-card.component.scss']
})
export class RewardCardComponent implements OnInit {

  @Input()
  card: HowToEarnCardModel;

  constructor() {
  }

  ngOnInit(): void {
  }

}
