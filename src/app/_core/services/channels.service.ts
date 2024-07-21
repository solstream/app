import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { LocalStorageService } from './auth-store.service';
import { VideoModel } from '../model/video.model';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { AccountModel, AccountWithUserModel } from '../model/accountModel';
import { VideoSearch } from './video-search.service';
import { IpfsClient } from "../client/ipfs.client";
import { IpfsResponse } from "../client/ipfs-resonse.model";
import { AccountClient } from "../client/account.client";

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  constructor(private client: HttpClient,
              private auth: LocalStorageService,
              private ipfsClient: IpfsClient,
              private accountClient: AccountClient
  ) {
  }

  getChannels(onlyLife: boolean, hasContent: boolean): Observable<any> {
    return this.client.get<any>(environment.publicAzure + `/room1?hasContent=${hasContent}&onlyLife=${onlyLife}`);
  }

  getHomePageChannels(): Observable<any> {
    return this.client.get<any>(environment.publicAzure + `/home/trending-channels`);
  }

  isRoomLive(roomName: string): Observable<boolean> {
    return this.client.get<boolean>(environment.publicAzure + `/room/${roomName}/is-live`);
  }

  isRoomLive1(roomId: string): Observable<boolean> {
    return this.client.get<boolean>(environment.publicAzure + `/room/${roomId}/is-live1`);
  }

  search(search?: string): Observable<AccountModel[]> {
    let params = new HttpParams();
    params = params.set('count', '50');
    if (search) {
      params = params.set('search', search);
    }
    return this.client.get<{ content: AccountModel[] }>(environment.publicAzure + `/room/search`, { params })
      .pipe(map(response => response.content));
  }

  getAccountsWithUser(search: string): Observable<AccountWithUserModel[]> {
    return this.client.get<AccountWithUserModel[]>(environment.privateAzure + '/users-rooms?search=' + search);
  }

  getUserRoom(): Observable<AccountModel> {
    const userName = this.auth.getSecurityUserName();
    return this.client.get<AccountModel>(environment.publicAzure + `/user/name/${userName}/room`);
  }

  isPremium(roomId: string): Observable<boolean> {
    return this.client.get<boolean>(environment.privateAzure + `/room/${roomId}/is-premium`);
  }

  setPremium(roomId: string, premium: boolean): Observable<void> {
    return this.client.post<void>(environment.privateAzure + `/room/${roomId}/premium/${premium}`, null);
  }

  getChannelByUserName(userName: string): Observable<AccountModel> {
    return this.client.get<AccountModel>(environment.publicAzure + `/user/name/${userName}/room`);
  }

  saveAccount(room: AccountModel, update = false): Observable<AccountModel> {
    if (update) {
      return this.updateRoom(room);
    }
    const userName = this.auth.getSecurityUserName();
    return this.client.post<AccountModel>(environment.privateAzure + `/user/${userName}/room`, room);
  }

  saveAccountByAdmin(room: AccountModel, update = false): Observable<AccountModel> {
    if (update) {
      return this.updateRoom(room);
    }
    return this.client.post<AccountModel>(environment.privateAzure + `/room`, room);
  }

  updateBio(roomName: string, bioText: string): Observable<AccountModel> {
    return this.getRoomByName(roomName).pipe(
      mergeMap((room: AccountModel) => {
        room.bioText = bioText;
        return this.updateRoom(room);
      })
    );
  }

  roomExists(roomName: string): Observable<boolean> {
    return this.client.get<boolean>(environment.publicAzure + `/room/${roomName}/exists`);
  }

  preStartLive(roomId: number): Observable<any> {
    return this.client.get(environment.privateAzure + `/room/${roomId}/pre-live`);
  }

  getRoomByName(roomName: string): Observable<AccountModel> {
    return this.client.get<AccountModel>(environment.publicAzure + `/room/name/${roomName}`);
  }

  updateRoom(room: AccountModel): Observable<any> {
    const userName = this.auth.getSecurityUserName();
    return this.client.put(environment.privateAzure + `/user/${userName}/room/${room.id}`, room);
  }

  getRoom(roomId): Observable<AccountModel> {
    return this.client.get<AccountModel>(environment.publicAzure + '/room/' + roomId);
  }

  // @Deprecated use saveAvatarImageIpfs
  saveAvatar(room: AccountModel, file: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.client.post(environment.privateAzure + `/account/${room.id}/avatar`, formData);
  }

  // @Deprecated use saveBackgroundImageIpfs
  saveBackgroundImage(room: AccountModel, file: any): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.client.post(environment.privateAzure + `/account/${room.id}/background`, formData);
  }

  saveBackgroundImageIpfs(roomId: string, file: any): Observable<any> {
    return this.ipfsClient.upload(file).pipe(
      switchMap((result: IpfsResponse) => {
        return this.accountClient.updateIcons(roomId, { backgroundUrl: result.path });
      }));
  }

  saveAvatarImageIpfs(roomId: string, file: any): Observable<any> {
    return this.ipfsClient.upload(file).pipe(
      switchMap((result: IpfsResponse) => {
        return this.accountClient.updateIcons(roomId, { avatarUrl: result.path });
      }));
  }

  createPublicStream(roomId: string, confId: string, title: string, record: boolean): Observable<VideoModel> {
    const reqBody = { confId, title, record };
    return this.client.post<VideoModel>(environment.privateAzure + `/room/${roomId}/start-podcast`, reqBody);
  }

  liveStatusCheckIn(roomName: string, userName: string): Observable<any> {
    return this.client.post(environment.privateAzure + `/room/${roomName}/host-check-in/${userName}`, null);
  }

  stopPodcast(podcastId: string): Observable<any> {
    return this.client.post(environment.privateAzure + `/podcast/${podcastId}/stop-podcast`, null);
  }

  copyRoomSnapshot(podcastId: string): Observable<any> {
    return this.client.post(environment.privateAzure + `/podcast/${podcastId}/copy-room-snapshot`, null);
  }

  subscribeToChannel(channelId: string): Observable<void> {
    return this.client.post<void>(environment.privateAzure + `/channel/${channelId}/subscribe`, null);
  }

  unSubscribeFromChannel(channelId: string): Observable<void> {
    return this.client.post<void>(environment.privateAzure + `/channel/${channelId}/un-subscribe`, null);
  }
}
