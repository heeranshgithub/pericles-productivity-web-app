export interface FocusSession {
  _id: string;
  userId: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  isActive: boolean;
}

export interface SessionStats {
  totalSessions: number;
  totalTime: number;
  averageTime: number;
  todaySessions: number;
  todayTime: number;
}
