export interface Conference {
  alias: string;
  confId: string;
  dolbyVoice: boolean;
  duration: number;
  end: number;
  live: boolean;
  mixerHlsStreaming: number;
  mixerLiveRecording: number;
  mixerRtmpStreaming: number;
  nbListeners: number;
  nbPstn: number;
  nbUsers: number;
  owner: {
    metadata: { externalName: string; ipAddress: string; };
    userId: number;
  };
  presenceDuration: number;
  recordingDuration: number;
  region: string;
  start: number;
  statistics: any;
  type: string;
}
