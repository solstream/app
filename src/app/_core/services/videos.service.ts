import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {NewVideoUploadRestrictions, VideoModel, VideoType2} from '../model/video.model';

@Injectable({
    providedIn: 'root'
})
export class VideoService {

    constructor(private httpClient: HttpClient) {
    }

    deleteVideo(videoId: string): Observable<void> {
        return this.httpClient.delete<void>(environment.privateAzure + `/video/${videoId}`);
    }

    canUploadVideo(): Observable<NewVideoUploadRestrictions> {
        return this.httpClient.get<NewVideoUploadRestrictions>(environment.privateAzure + `/video/can-upload`);
    }

    likeVideo(videoId: string): Observable<void> {
        return this.httpClient.post<void>(environment.privateAzure + `/video/${videoId}/like`, null);
    }

    unlikeVideo(videoId: string): Observable<void> {
        return this.httpClient.post<void>(environment.privateAzure + `/video/${videoId}/un-like`, null);
    }

    getUploadedVideos(roomId: string, hostMode: boolean): Observable<VideoModel[]> {
        return this.httpClient.get<VideoModel[]>(environment.publicAzure + `/room/${roomId}/video/${hostMode}`);
    }

    getPops(roomId: string, hostMode: boolean): Observable<VideoModel[]> {
        return this.httpClient.get<VideoModel[]>(environment.publicAzure + `/room/${roomId}/pops/${hostMode}`);
    }

    getLiveRecords(roomId: string): Observable<VideoModel[]> {
        return this.httpClient.get<VideoModel[]>(environment.publicAzure + `/room/${roomId}/live-records`);
    }

    getAllChannelVideos(roomName: string): Observable<VideoModel[]> {
        return this.httpClient.get<VideoModel[]>(environment.publicAzure + `/room-by-name/${roomName}/videos`);
    }

    getRecentVideos(): Observable<VideoModel[]> {
        // Generate mock videos with random properties for demonstration
        // @ts-ignore
        const mockVideos: VideoModel[] = Array.from({ length: 10 }, (_, i) => ({
            id: `recentMockId${i}`,
            title: `Recent Mock Video ${i}`,
            videoType: Object.values(VideoType2)[Math.floor(Math.random() * Object.values(VideoType2).length)],
            // Add other necessary properties from your VideoModel here, for example:
            roomPremium: Math.random() > 0.5,
            // Assuming `roomPremium` is a boolean indicating if the video is premium or not
        }));

        return of(mockVideos);
    }
    createVideoWithoutFile(roomId: string, videoTitle: string, isPop: boolean, duration: number): Observable<VideoModel> {
        const url = `/room/${roomId}/video`;
        const requestBody = {title: videoTitle, isPop, duration: Math.round(duration)};
        return this.httpClient.post<VideoModel>(environment.privateAzure + url, requestBody);
    }

    getAllPops(): Observable<VideoModel[]> {
        const url = `/videos/pops`;
        return this.httpClient.get<VideoModel[]>(environment.publicAzure + url);
    }

    uploadSnapshot(roomId: string, videoId: string, snapshotFile: any): Observable<VideoModel> {
        const formData = new FormData();
        formData.append('snapshotFile', snapshotFile);
        const url = `/room/${roomId}/video/${videoId}/snapshot`;
        return this.httpClient.post<VideoModel>(environment.privateAzure + url, formData);
    }

    uploadSnapshotIpfs(roomId: string, videoId: string, snapshotFile: any): Observable<any> {
        const formData = new FormData();
        formData.append('file', snapshotFile);
        const url = environment.ipfsService + `/ipfs/video`;
        return this.httpClient.post(url, formData);
    }

    uploadVideoToIpfs(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        const url = environment.ipfsService + `/ipfs/video`;
        return this.httpClient.post(url, formData, {reportProgress: true, observe: 'events'});
    }


    getAzureUploadSas(videoId: string, fileName: string): Observable<FileSasResponse> {
        const url = `/video/${videoId}/sas/${fileName}`;
        return this.httpClient.get<FileSasResponse>(environment.privateAzure + url);
    }

    // TODO remove when BE cleaned up
    // setVideoStatus(roomId: string, videoId: string, status: string): Observable<VideoModel> {
    //     const url = `/room/${roomId}/uploaded-video/${videoId}/status/${status}`;
    //     return this.httpClient.post<VideoModel>(environment.privateAzure + url, null);
    // }

    completeUpload(videoId: string): Observable<void> {
        const url = `/video/${videoId}/complete`;
        return this.httpClient.put<void>(environment.privateAzure + url, null);
    }

    completeUploadIpfs(videoId: string, ipfsUrl: string, ipfsSnapshotUrl): Observable<void> {
        const url = `/video/${videoId}/complete`;
        return this.httpClient.put<void>(environment.privateAzure + url, {ipfsUrl, ipfsSnapshotUrl});
    }

}

export interface FileSasResponse {
    val: string;
    url: string;
}

