import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-live-chip',
  templateUrl: './live-chip.component.html',
  styleUrls: ['../live-chip.component.scss']
})
export class LiveChipComponent {
  @Input()
  isCarousel = false;
}
