import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EarningsAuditService {

  constructor(private httpClient: HttpClient) {
  }

  auditVideoStart(videoId: string): Observable<void> {
    const req: WteAuditRequest = {type: 'video_start', entityId: videoId};
    return this.httpClient.post<void>(environment.privateAzure + '/wte/audit', req);
  }

  auditVideoStop(videoId: string): Observable<void> {
    const req: WteAuditRequest = {type: 'video_stop', entityId: videoId};
    return this.httpClient.post<void>(environment.privateAzure + '/wte/audit', req);
  }

  getAuditLogs(accountName: string): Observable<WteAuditEventApiModel[]> {
    return this.httpClient.get<WteAuditEventApiModel[]>(environment.privateAzure + `/wte/audit/${accountName}`);
  }
}

export interface WteAuditRequest {
  type: VideoAuditType;
  entityId: string;
}
export type VideoAuditType = 'video_start' | 'video_stop';
export interface WteAuditEventApiModel {
   id: number;
   userName: string;
   accountId: string;
   accountName: string;
   type: VideoAuditType;
   entityId: string;
   time: Date;
}
