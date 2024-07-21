import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WithdrawalsAuditService {

  constructor(private http: HttpClient) { }

  getWithdrawals(status: WithdrawalStatus, userName?: string, offset: number = 0, limit: number = 1000): Observable<AuditWithdrawals> {
    let params = new HttpParams();
    params = params.append('status', status);
    params = params.append('start', offset.toString());
    params = params.append('count', limit.toString());

    if (userName) {
        params = params.append('userName', userName);
    }

    return this.http.get<AuditWithdrawals>(environment.privateAzure + '/withdrawals', { params });
  }

  approveWithdrawal(withdrawalId: number, amount: number): Observable<void> {
    return this.http.post<void>(environment.privateAzure + '/withdrawals/approve', { amount, withdrawalId });
  }

  rejectWithdrawal(withdrawalId: number, amount: number): Observable<void> {
    return this.http.post<void>(environment.privateAzure + '/withdrawals/reject', { amount, withdrawalId });
  }

  transferWithdrawal(withdrawalId: number, transactionUrl: string, amount: number): Observable<void>  {
    return this.http.post<void>(environment.privateAzure + '/withdrawals/transfer', { amount, withdrawalId, transactionUrl });
  }

}

export type WithdrawalStatus = 'requested' | 'approved' | 'rejected' |  'transferred' | 'error';

export interface AuditWithdrawals {
  content: AuditWithdrawal[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface AuditWithdrawal {
  accountId: string;
  accountName: string;
  amount: number;
  created: string;
  id: number;
  status: WithdrawalStatus;
  userName: string;
}
