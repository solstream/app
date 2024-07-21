import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {AccountModel} from '../model/accountModel';
import {VideoModel} from '../model/video.model';
import {TrendingContentModel} from './trending-content.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelContentService {

  constructor(private client: HttpClient) { }

  getChannelsWithContent(): Observable<any> {
    return this.client.get<any>(environment.publicAzure + '/room1?hasContent=true');
  }

  getSideBarChannelsList(): Observable<any> {
    return this.client.get<any>(environment.publicAzure + '/channels/list');
    // return this.client.get<any>(environment.publicAzure + '/sn-c/channels/list');
  }

  getOtherContentVideos(): Observable<TrendingContentModel> {
    return this.client.get<any>(environment.publicAzure + '/channels/other-content');
    // return this.client.get<any>(environment.publicAzure + '/sn-c/channels/other-content');
  }

  getChannels(onlyLife: boolean, hasContent: boolean): Observable<any> {
    return this.client.get<any>(environment.publicAzure + `/room1?hasContent=${hasContent}&onlyLife=${onlyLife}`);
  }

  isRoomLive(roomName: string): Observable<AccountModel[]> {
    return this.client.get<AccountModel[]>(environment.publicAzure + `/room/${roomName}/is-live`);
  }

  checkInRoom(roomName: any, userId: any): Observable<any> {
    return this.client.post<any>(environment.publicAzure + `/room/${roomName}/check-in/${userId}`, null);
  }

}
