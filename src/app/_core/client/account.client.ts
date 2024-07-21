import { Injectable } from '@angular/core';
import { AccountModel } from '../model/accountModel';
import { Observable } from 'rxjs';
import { AccountIconsRequest } from './account-api.models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
// Account is the same as Room, Room is more of legacy name
export class AccountClient {

  constructor(private client: HttpClient) {
  }

  updateIcons(accountId: string, accountIconsRequest: AccountIconsRequest): Observable<AccountModel> {
    return this.client.post<AccountModel>(
      environment.privateAzure + `/account/${accountId}/icons`,
      accountIconsRequest);
  }


}
