import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.scss']
})
export class MaintenanceComponent implements OnInit {
  //TODO if there is no previuos route, this page should check if maintenance is on, if not redirect home
  constructor() { }

  ngOnInit(): void {
  }

}
