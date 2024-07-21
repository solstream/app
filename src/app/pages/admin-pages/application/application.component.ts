import {Component, OnInit} from '@angular/core';
import {ApiStatusService} from '../../../_core/services/api-status.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  initVal = false;
  val = false;
  changed = false;

  constructor(private apiStatusService: ApiStatusService) { }

  ngOnInit(): void {
    this.getStatus();
  }

  private getStatus(): void {
    this.val = false;
    this.initVal = false;
    this.changed = false;
  }

  change(val: MatSlideToggleChange): void {
    this.val = val.checked;
    this.changed = this.val !== this.initVal;
  }

  save(): void {
    // this.apiStatusService.saveStatus(this.val).subscribe(() => {
    //   this.getStatus();
    // });
  }

}
