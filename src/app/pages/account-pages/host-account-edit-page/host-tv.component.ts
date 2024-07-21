import { Component, OnInit } from '@angular/core';
import {ChannelsService} from '../../../_core/services/channels.service';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterService} from '../../../_core/services/router.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {AccountModel} from '../../../_core/model/accountModel';
import {VideoService} from '../../../_core/services/videos.service';
import {VideoModel} from '../../../_core/model/video.model';
import {CurrentUserState} from '../../../_core/services/current-user-state.service';

@Component({
  selector: 'app-channel-info',
  templateUrl: './host-tv.component.html',
  styleUrls: ['./host-tv.component.scss']
})
export class HostTvComponent implements OnInit {

  room: AccountModel;
  recentPodcasts: VideoModel[];
  recentVideos: VideoModel[];

  constructor(public mob: DeviceDetectorService,
              private roomService: ChannelsService,
              private currentUserService: CurrentUserState,
              private routerService: RouterService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const roomName = this.activatedRoute.snapshot.paramMap.get('roomName');
    this.roomService.getRoomByName(roomName).subscribe((room) => {
      if (room === null) {
        this.routerService.navigateToNewRoom();
      }
      this.room = room;
    });
  }



}
