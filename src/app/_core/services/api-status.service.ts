import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiStatusService {

  constructor(private httpClient: HttpClient) { }

  getStatus(): Observable<StatusApiModel> {
    return this.httpClient.get<StatusApiModel>(environment.publicAzure + '/status');
  }

  saveStatus(status: boolean): Observable<StatusApiModel> {
    return this.httpClient.post<StatusApiModel>(environment.privateAzure + '/admin/status/maintenance/' + status, null );
  }

}

export interface StatusApiModel {
  status: string;
  maintenance: boolean;
}
