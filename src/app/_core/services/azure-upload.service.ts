import {Injectable} from '@angular/core';
import {BlobServiceClient, BlobUploadCommonResponse, BlockBlobClient, ContainerClient} from '@azure/storage-blob';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AzureUploadService {

    constructor(private httpClient: HttpClient) {
    }

    getSas(): Observable<SasResponse> {
        return this.httpClient.get<SasResponse>(environment.privateAzure + '/public/sas2');
    }

    uploadToAzureBlob(file: File, sasToken: SasResponse): Observable<BlobUploadResponse> {
        return new Observable<BlobUploadResponse>(observer => {
            const blobService = new BlockBlobClient(sasToken.val);
            blobService.uploadData(file, {
                onProgress: prog => observer.next({event: 'progress', progress: Math.round((prog.loadedBytes * 100) / file.size)})
            }).then(() => {
                observer.next({event: 'complete'});
                observer.complete();
            }, (e: Error) => {
                console.error(e);
                observer.error(e);
                observer.complete();
            });
        });
    }
}

export interface SasResponse {
    val: string;
}

export interface BlobUploadResponse {
    event: 'progress' | 'complete';
    progress?: number;
}
