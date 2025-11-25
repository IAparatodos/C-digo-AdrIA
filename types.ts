export enum VoiceName {
  Puck = 'Puck',
  Charon = 'Charon',
  Kore = 'Kore',
  Fenrir = 'Fenrir',
  Zephyr = 'Zephyr',
}

export interface SpeechConfig {
  voice: VoiceName;
  text: string;
}

export interface GeneratedAudio {
  blob: Blob;
  url: string;
  duration: number;
}
