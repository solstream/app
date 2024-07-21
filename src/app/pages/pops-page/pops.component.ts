import { Component, OnInit } from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {VideoService} from '../../_core/services/videos.service';
import {VideoModel} from '../../_core/model/video.model';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-pops',
  templateUrl: './pops.component.html',
  styleUrls: ['./pops.component.scss']
})
export class PopsComponent implements OnInit {

  isMobile = false;
  pops: VideoModel[] = [];

  constructor(private mob: DeviceDetectorService,
              private videoService: VideoService,
              private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.videoService.getAllPops().subscribe(pops => {
      console.log(id);
      const index = pops.findIndex(pop => pop.id === id);
      console.log(index);
      this.pops = pops.slice(index, pops.length);
    });
  }

}
