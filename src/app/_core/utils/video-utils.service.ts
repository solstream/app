import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class VideoUtils {

    private getVideoDimensions(file: File): Observable<VideoDimensions> {
        const response = new Subject<VideoDimensions>();
        const videoElem: HTMLVideoElement = document.createElement('video');
        videoElem.src = window.URL.createObjectURL(file);
        videoElem.addEventListener('loadedmetadata', (e) => {
            response.next({height: videoElem.videoHeight, width: videoElem.videoWidth});
            response.complete();
            videoElem.remove();
        });
        return response;
    }

    isPop(file: File): Observable<boolean> {
        return this.getVideoDimensions(file).pipe(map(dimensions => dimensions.width < dimensions.height));
    }

}

export interface VideoDimensions {
    height: number;
    width: number;
}
