import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-donation-received',
  templateUrl: './donation-received.component.html',
  styleUrls: ['./donation-received.component.scss']
})
export class DonationReceivedComponent implements OnInit {
  @Input() public amount: any;
  @Input() public donator: any;
  randomShow = false;
  textArray = [
    'John', 'SuperMan', 'TheBestOfMe',
    'Mario', 'Goku', 'Celine98',
      'Gamer89', 'CryptoLover', 'Genius233', 'Nova1', 'HomerSimpson', 'MainGoal', 'Paul12', 'GeordieM', 'RosieB', 'Lara', 'X22'
  ];
  constructor() { }

  ngOnInit(): void {
    // setInterval(() => {
    //   this.randomShow = !this.randomShow;
    //   this.donator = this.textArray[Math.floor(Math.random() * this.textArray.length)];
    // },5000 );
  }

}
