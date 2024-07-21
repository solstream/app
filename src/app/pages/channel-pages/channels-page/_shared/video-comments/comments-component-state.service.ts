import {Injectable} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {CurrentUserState} from '../../../../../_core/services/current-user-state.service';
import {tap} from 'rxjs/operators';
import {VideoModel} from '../../../../../_core/model/video.model';
import {AccountModel} from '../../../../../_core/model/accountModel';
import {Comment} from '@angular/compiler';
import {getVersionUpgradeData} from '@angular/cdk/schematics';

@Injectable({
    providedIn: 'root'
})
export class CommentsComponentState {
    private basePublicUrl = environment.publicAzure;
    private basePrivateUrl = environment.privateAzure;
    comments$ = new BehaviorSubject<CommentsAPIModel[]>([]);
    currentVideo$ = new BehaviorSubject<VideoModel>(null);

    constructor(private httpClient: HttpClient) {
    }

    postComment(message: string): Observable<CommentsAPIModel> {
        const videoId = this.currentVideo$.value.id.toString();
        const request = {text: message} as CommentRequestModel;
        return this.httpClient.post<CommentsAPIModel>(`${this.basePrivateUrl}/video/${videoId}/comments`, request);
    }

    deleteComment(id: number): Observable<any> {
        const videoId = this.currentVideo$.value.id.toString();
        return this.httpClient.delete(`${this.basePrivateUrl}/video/${videoId}/comments/${id}`);
    }

    getVideoComments(video: VideoModel): Observable<CommentsAPIModel[]> {
        return this.httpClient.get<CommentsAPIModel[]>(`${this.basePublicUrl}/video/${video.id}/comments`)
            .pipe(
                tap((rez) => this.comments$.next(rez)),
                tap(() => this.currentVideo$.next(video))
            );
    }

}

export interface CommentsAPIModel {
    id: number;
    text: string;
    userName: string;
    userAvatarUrl: string;
    createDate: string;
    premium: boolean;
}

export interface CommentRequestModel {
    text: string;
}

export interface CommentsComponentModel extends CommentsAPIModel {
    color: string;
}
