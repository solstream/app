import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {StreamerContextState} from './stream-context-state.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SnapshotsService {

    constructor(private currentStreamContextState: StreamerContextState, private client: HttpClient) {
    }

    // TODO probably screen share snapshot doesnt work
    captureVideoStream(stream, type: SnapshotType): void {
        const roomName = this.currentStreamContextState.hostRoom$.value.roomName;
        const track = stream.getVideoTracks()[0];
        const videoCapture = new ImageCapture(track);
        videoCapture.takePhoto().then((uu) => {
            const file = new File([uu], roomName);
            this.upload(file, roomName, type);
        });
    }

    imageToBlob(url: string): Observable<Blob> {
        return this.client.get(url, {responseType: 'blob'});
    }

    capturePodcastSnapshot(stream: Blob, podcastId: string): Observable<void> {
        const roomName = this.currentStreamContextState.hostRoom$.value.roomName;
        const roomId = this.currentStreamContextState.hostRoom$.value.id;
        const file = new File([stream], roomName);
        const formData = new FormData();
        formData.append('file', file);
        return this.client.post<void>(environment.privateAzure + `/room/${roomId}/podcast/${podcastId}/snapshot`, formData);
    }

    private upload(file: File, roomName: string, type: SnapshotType): void {
        const formData = new FormData();
        formData.append('file', file);
        this.client.post(environment.privateAzure + `/file/upload/${type}/${roomName}`, formData).subscribe();
    }

}

export type SnapshotType = 'conf-snapshot' | 'screen-snapshot';
