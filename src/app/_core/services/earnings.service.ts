import {Injectable} from '@angular/core';
import {BehaviorSubject, interval, Observable, of, Subscription, timer} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {filter, takeWhile, tap} from 'rxjs/operators';

const DEFAULT_PROGRESS = 0;
const TIME_TOTAL_PROGRESS = 30; // seconds

@Injectable({
    providedIn: 'root'
})
export class EarningsService {

    public progressEarned$ = new BehaviorSubject<number>(0);
    public activeSubscription: Subscription;

    private progress = DEFAULT_PROGRESS;
    private progressTimer: Observable<any>;

    constructor(private httpClient: HttpClient) {
    }

    /**
     * PROGRESS BAR
     */

    public getProgress(): Observable<number> {
        return this.progressEarned$.asObservable();
    }

    public startProgress(): void {
        this.progressTimer = this.createProgressTimer();

        this.activeSubscription = this.progressTimer.subscribe(() => {
            this.progressEarned$.next(this.progress);
        });
    }

    public pauseProgress(): void {
        if (this.activeSubscription) {
            this.activeSubscription.unsubscribe();
            this.progressTimer = null;
        }
    }

    /**
     * Generate an observable that emits an event every x seconds up and counts from 0 to 100 to
     * indicate the progress of the user in the earn progress component
     * The time this will take can be specified in seconds by updating TIME_TOTAL_PROGRESS
     */
    public createProgressTimer(): Observable<any> {
        const time = (TIME_TOTAL_PROGRESS * 1000) / 100;

        return interval(time)
            .pipe(
                takeWhile(() => !this.activeSubscription.closed),
                filter(() => !document.hidden),
                tap(() => {

                    this.progress++;

                    if (this.progress > 100) {
                        this.progress = DEFAULT_PROGRESS;
                    }
                })
            );
    }

    getEarningsV3(offset: number = 0, limit: number = 1000): Observable<EarningsResponse> {
        let params = new HttpParams();
        params = params.append('start', offset.toString());
        params = params.append('count', limit.toString());

        return this.httpClient.get<EarningsResponse>(environment.privateAzure + '/earnings', {params});
    }

    getTotalEarningsV3(): Observable<EarningsApiModel1> {
        return this.httpClient.get<any>(environment.privateAzure + '/earnings/total');
    }

    earnV3(videoId: string): Observable<void> {
        const earnRequest: EarnRequest = {videoId, track: '123234876548765'};
        return this.httpClient.post<void>(environment.privateAzure + '/earn', earnRequest);
    }

    // only testing purposes
    reset(): Observable<EarningLedge[]> {
        return this.httpClient.get<EarningLedge[]>(environment.privateAzure + '/reset');
    }

}

export interface EarningsApiModel1 {
    earnings: number;
}

export interface EarnRequest {
    videoId: string;
    track: string;
}

export interface EarningLedge {
    userId: string;
    accountId: string;
    videoId: string;
    accountName: string;
    earnings: string;
    created: Date;
    type: string;
}

export interface EarningsResponse {
    content: EarningLedgeV3[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
}

export interface EarningLedgeV3 {
    userName: string;
    accountName: string;
    videoId: string;
    videoTitle: string;
    videoAccountAvatarUrl: string;
    created: Date;
    earnings: string;
    type: ActionType;
}

export type ActionType = 'watching_video' | 'withdrawal' | 'provided_video_watched' | 'comment' | 'like' | 'signup';
type ActionTypeMap = { [action in ActionType]: string };

export const actionTypesMap: ActionTypeMap = {
    comment: 'Commenting',
    like: 'Like',
    signup: 'Signup',
    watching_video: 'Watched video',
    withdrawal: 'Withdraw',
    provided_video_watched: 'Watched video',
};
