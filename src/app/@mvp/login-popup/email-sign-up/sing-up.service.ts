import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SingUpService {

  constructor(private httpClient: HttpClient) { }

  signUp(request: EmailSignupRequest): Observable<any> {
    return this.httpClient.post(environment.privateAzure + '/sign-up', request);
  }

  resetPass(token: string, password: string): Observable<any> {
    return this.httpClient.post(environment.publicAzure + '/update-password', {token, password});
  }

}

export interface EmailSignupRequest {
  username: string;
  password: string;
  invitationCode: string;
}
