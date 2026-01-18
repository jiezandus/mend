export enum AppMode {
  LANDING = 'LANDING',
  CREATOR = 'CREATOR',
  GAME = 'GAME',
  RESOLUTION = 'RESOLUTION',
}

export interface ApologyPayload {
  scenario: string;
  customMessage: string;
  senderName: string;
}

export enum ScenarioType {
  LATE = 'I was late',
  FORGOT = 'I forgot something important',
  FOOD = 'I ate your food',
  GHOSTED = 'I accidentally ghosted',
  CLUMSY = 'I broke something',
}

export interface Mole {
  id: number;
  status: 'up' | 'down' | 'hit';
  type: 'normal' | 'heart';
}
