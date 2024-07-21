import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private privateBaseUrl = environment.privateAzure;
    private publicBaseUrl = environment.publicAzure;

    constructor(private httpClient: HttpClient) {
    }

    createMessage(message: MessageApiModel): Observable<MessageApiModel[]> {
        return this.httpClient.post<MessageApiModel[]>(`${this.privateBaseUrl}/messages`, message);
    }

    getMessages(roomName: string, confId: string): Observable<MessageApiModel[]> {
        return this.httpClient.get<MessageApiModel[]>(`${this.publicBaseUrl}/messages/${roomName}/${confId}`);
    }

    // TODO based on app video based refactor, messages should be podcastId based not roomId+confId
    createMessage2(podcastId: string, text: string): Observable<MessageApiModel> {
        return this.httpClient.post<MessageApiModel>(`${this.privateBaseUrl}/podcast/${podcastId}/messages`, {text});
    }

    getMessages2(podcastId: string, confId: string): Observable<MessageApiModel[]> {
        return this.httpClient.get<MessageApiModel[]>(`${this.publicBaseUrl}/podcast/${podcastId}/messages`);
    }

    deleteMessageNew(messageId: number): Observable<void>{
        return this.httpClient.delete<void>(`${this.privateBaseUrl}/messages/${messageId}`);
    }

    // TODO userService
    banUser(messageId: number): Observable<void>{
        return this.httpClient.post<void>(`${this.privateBaseUrl}/ban-user/${messageId}`, null);
    }
}

export interface MessageApiModel {
    id?: number;
    userName: string;
    text: string;
    roomName: string;
    confId: string;
    color?: string;
}
