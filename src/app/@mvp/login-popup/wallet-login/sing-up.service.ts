import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SingUpService {

    constructor(private httpClient: HttpClient) {
    }

    signUp(request: SingUpRequest): Observable<any> {
        return this.httpClient.post(environment.privateAzure + '/sign-up', request);
    }

}

export interface SingUpRequest {
    username: string;
    password: string;
}
