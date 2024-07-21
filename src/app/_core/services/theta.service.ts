import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThetaService {

    constructor(private client: HttpClient) {
    }

    createStream(accountName: string): Observable<ThetaStreamEntity> {
        return this.client.post<ThetaStreamEntity>(environment.privateAzure + `/account/${accountName}/theta`, null);
    }

    getStreamKey(accountName: string): Observable<ThetaStreamEntity> {
        return this.client.get<ThetaStreamEntity>(environment.privateAzure + `/account/${accountName}/theta`);
    }
}

export interface ThetaStreamEntity {

    idAccountName: string;
    streamName: string;
    streamKey: string;
    playbackId: string;

}
