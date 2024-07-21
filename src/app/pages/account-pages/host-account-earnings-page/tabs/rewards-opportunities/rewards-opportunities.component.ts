import {Component, OnInit} from '@angular/core';
import { HowToEarnCardModel } from 'src/app/_core/model/how-to-earn-card.model';
import {HOW2EARN_CARDS} from '../../constants/how2earn-cards';

@Component({
    selector: 'app-rewards-opportunities',
    templateUrl: 'rewards-opportunities.component.html',
    styleUrls: ['./rewards-opportunities.component.scss']
})
export class RewardsOpportunitiesComponent implements OnInit {

    public cards: HowToEarnCardModel[] = [];

    constructor() {}

    ngOnInit(): void {
        this.addCards();
    }

    addCards(): void {
        this.cards.push(...HOW2EARN_CARDS);
    }

}
