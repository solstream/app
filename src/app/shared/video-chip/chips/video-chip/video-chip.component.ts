import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-uploaded-video-chip',
  templateUrl: './video-chip.component.html',
  styleUrls: ['./video-chip.component.scss', '../live-chip.component.scss']
})
export class UploadedVideoChipComponent {
  @Input()
  isCarousel = false;
}
