import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {AccountModel} from '../model/accountModel';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(private client: HttpClient) { }
  videoViewed(videoId: string): Observable<void> {
    return this.client.post<void>(environment.publicAzure + `/audit/video/${videoId}/view`, null);
  }

  updateChannelVisitCount(roomId: string): Observable<AccountModel> {
    return this.client.post<AccountModel>(environment.publicAzure + `/room/${roomId}/visit`, null);
  }

  updatePodcastViews(roomName: string, userName: string): Observable<AccountModel> {
    return this.client.post<AccountModel>(environment.publicAzure + `/room/${roomName}/watchers/${userName}`, null);
  }

}
