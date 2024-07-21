import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-record-chip',
  templateUrl: './record-chip.component.html',
  styleUrls: ['./record-chip.component.scss', '../live-chip.component.scss']
})

export class RecordChipComponent {
  @Input()
  isCarousel = false;
}
