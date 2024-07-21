import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IpfsResponse } from './ipfs-resonse.model';

@Injectable({
  providedIn: 'root'
})
export class IpfsClient {

  private readonly url = environment.ipfsService + `/ipfs/content`;

  constructor(private httpClient: HttpClient) { }

  upload(snapshotFile: any): Observable<IpfsResponse> {
    const formData = new FormData();
    formData.append('file', snapshotFile);
    return this.httpClient.post<IpfsResponse>(this.url, formData);
  }
}
