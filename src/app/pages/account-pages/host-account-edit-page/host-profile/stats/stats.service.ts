import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private client: HttpClient) { }

  getStats(roomId: string): Observable<StreamingStats> {
    return this.client.get<StreamingStats>(environment.privateAzure + `/room/${roomId}/streaming-stats`);
  }
}

export interface StreamingStats {
  statsPerMonth: [{month: string, minutes: number}];
  statsTotal: {totalMinutesStreamed: number};
  streamViews: number;
}
