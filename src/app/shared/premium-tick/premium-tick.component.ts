import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-premium-tick',
  templateUrl: './premium-tick.component.html',
  styleUrls: ['./premium-tick.component.scss']
})
export class PremiumTickComponent implements OnInit {

  constructor() { }
  @Input()
  isVerified = false;
  ngOnInit(): void {
  }

}
