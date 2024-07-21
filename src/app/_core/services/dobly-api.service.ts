import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {LocalStorageService} from './auth-store.service';

@Injectable({
    providedIn: 'root'
})
export class DoblyApiService {

    constructor(private client: HttpClient,
                private authStore: LocalStorageService) {
    }

    buildDoblyServiceHeader(): Observable<any> {
       return this.getServiceHeader(this.authStore.getDolbyKey(), this.authStore.getDolbySecret());
    }

    private getServiceHeader(key, secret): Observable<HttpHeaders> {
        const headers = this.getReqHeader(key, secret);
        const searchParams = this.getSearchParams();
        return this.client.post('https://api.voxeet.com/v1/auth/token', searchParams.toString(), {headers}).pipe(
            map((resp: any) => {
                const token = resp.access_token;
                return this.formatDolbyServiceAPIHeader(token);
            }));
    }

    private formatDolbyServiceAPIHeader(token: string): HttpHeaders {
        return new HttpHeaders({
            Authorization: 'Bearer ' + token
        });
    }

    private getSearchParams(): URLSearchParams {
        const body = new URLSearchParams();
        body.set('grant_type', 'client_credentials');
        return body;
    }

    private getReqHeader(key: string, secret: string): HttpHeaders {
        const basicCredentials = 'Basic ' + btoa(encodeURI(key) + ':' + encodeURI(secret));
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
            Authorization: basicCredentials
        });
        return headers;
    }
}
