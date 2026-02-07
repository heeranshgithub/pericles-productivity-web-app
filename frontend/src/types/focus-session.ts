export enum SessionType {
  POMODORO = 'pomodoro',
  STOPWATCH = 'stopwatch',
}

export interface FocusSession {
  _id: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  isActive: boolean;
  sessionType: SessionType;
  targetDuration: number | null;
  isBreak: boolean;
}

export interface StartSessionParams {
  sessionType?: SessionType;
  targetDuration?: number;
  isBreak?: boolean;
}

export interface SessionStats {
  totalSessions: number;
  totalTime: number;
  averageTime: number;
  todaySessions: number;
  todayTime: number;
}
