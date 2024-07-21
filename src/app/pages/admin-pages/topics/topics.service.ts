import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicsService {

  constructor(private httpClient: HttpClient) { }

  getMainSearchTopics(): Observable<TopicApiModel[]> {
   return this.httpClient.get<TopicApiModel[]>(environment.publicAzure + `/topics/main-search-topic`);
  }

  getAllUserProvidedTopics(): Observable<string[]> {
    return this.httpClient.get<string[]>(environment.publicAzure + `/topics/all-user-provided`);
  }

  addTopic(topic: TopicApiModel): Observable<void> {
   return this.httpClient.post<void>(environment.publicAzure + `/topics/select-topics`, topic);
  }

  setMain(topicId: number, value: boolean): Observable<void> {
   return this.httpClient.post<void>(environment.publicAzure + `/topics/${topicId}/main/${value}`, null);
  }

  getAllTopics(): Observable<TopicApiModel[]> {
    return this.httpClient.get<TopicApiModel[]>(environment.publicAzure + `/topics/select-topics`);
  }

}

export interface TopicApiModel {
   id: number;
   topicCode: string;
   topicName: string;
   mainSearch: boolean;
}
