import {VideoModel} from './video.model';
import {User} from '../../pages/admin-pages/admin.component';

// TODO important - should not extend VideoModel
export interface AccountModel extends VideoModel {
    id: string;

    // user only for security purposes, wallet ID
    userName: string;

    // profile name
    roomName: string;
    roomTitle: string;
    streamingTitle: string;
    roomDescription: string;
    roomTopic: string;
    qrCode: string;
    observersCount: number;
    streamSnapshotUrl: string;
    isLive: boolean;
    premium: boolean;
    views: number;
    avatarAzureUrl: string;
    backgroundUrl: string;
    bioText: string;
    conferenceId: string;
    streamTitle: string;
    subscribers: number;


    streamKey?: string;
}

export interface AccountWithUserModel {
    id: string;
    userName: string;
    user: User;
    roomName: string;
    roomTitle: string;
    roomDescription: string;
    roomTopic: string;
    qrCode: string;
    observersCount: number;
    streamSnapshotUrl: string;
    isLive: boolean;
    avatarAzureUrl: string;
    backgroundUrl: string;
    bioText: string;
    conferenceId: string;
    premium: boolean;
    createDate: boolean;
    ipAddress: string;
    totalContentCount: number;
}
