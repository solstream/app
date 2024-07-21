import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {VideoModel} from '../model/video.model';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VideoSearchService {

    constructor(private httpClient: HttpClient) {
    }

    search(start: number, count: number, search?: string, topic?: string): Observable<VideoSearch> {
        let params = new HttpParams();
        params = params.set('start', start.toString());
        params = params.set('count', count.toString());
        if (search) {
            params = params.set('search', search);
        }
        if (topic) {
            params = params.set('topic', topic);
        }
        return this.httpClient.get<VideoSearch>(environment.publicAzure + `/browse`, {params});
    }

}

export interface VideoSearch {
    page: number;
    content: VideoModel[];
}
