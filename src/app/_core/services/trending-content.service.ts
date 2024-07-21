import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {VideoModel} from '../model/video.model';

@Injectable({
    providedIn: 'root'
})
export class TrendingContentService {

    constructor(private client: HttpClient) {
    }

    getTrendingContent(): Observable<TrendingContentModel> {
        return this.client.get<TrendingContentModel>(`${environment.publicAzure}/home/trending-content`);
    }
}

export interface TrendingContentModel {
    videos: VideoModel[];
}
