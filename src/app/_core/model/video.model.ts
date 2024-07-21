import {AccountModel} from './accountModel';

export interface VideoModel {
    id: string;
    title: string;
    time: Date;
    views: number;
    videoType: VideoType2;
    videoFileUrl: string;
    snapShotUrl: string;
    ipfsMetaData: string;
    confId: boolean;
    // premium: boolean;
    roomId: string;
    roomName: string;
    roomTitle: string;
    roomAvatarUrl: string;
    roomTopic: string;
    roomPremium: boolean;
    earnings: number;
    likes: number;
    ipfsGatewayUrl?: string;
    short?: boolean;
    duration: number;
}

export interface VideoTwModel extends VideoModel, AccountModel {
    active: boolean;
    position: string;
}

export enum VideoType2 {
    PODCAST_LIVE = 'podcast_live',
    PODCAST_RECORD = 'podcast_record',
    LIVE_PEER_LIVE = 'live_peer_stream',
    LIVE_PEER_RECORD = 'live_peer_record',
    UPLOADED_VIDEO = 'uploaded_video',
    POP = 'pop'
}

export interface CarouselVideoModel extends VideoModel {
    bio?: string;
}

export enum VideoState {
    DEFAULT = 'not_playing',
    PLAYING = 'playing',
    PAUSED = 'paused'
}

export interface NewVideoUploadRestrictions {
    allowed: boolean;
    maxSize: number;
    maxCount: number;
    currentCount: number;
    message: string;
}



