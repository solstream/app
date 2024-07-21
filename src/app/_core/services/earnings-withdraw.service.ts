import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EarningsWithdrawService {

  constructor(private httpClient: HttpClient) { }


  getWithdrawals(offset: number = 0, limit: number = 1000): Observable<WithdrawalResponse> {
    let params = new HttpParams();
    params = params.append('start', offset.toString());
    params = params.append('count', limit.toString());

    return this.httpClient.get<WithdrawalResponse>(environment.privateAzure + '/withdrawals', { params });
  }

  withdraw(amount: number, walletId: string): Observable<void> {
    const req: WithdrawRequest = {amount, walletId};
    return this.httpClient.post<void>(environment.privateAzure + '/withdraw', req);
  }
}

export interface WithdrawalResponse{
  content: WithdrawalApiModel[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface WithdrawalApiModel {
  userName: string;
  accountId: string;
  accountName: string;
  amount: number;
  status: string;
  created: Date;
}

export interface WithdrawRequest {
  amount: number;
  walletId: string;
}


