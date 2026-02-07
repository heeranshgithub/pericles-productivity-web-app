import { baseApi } from './baseApi';
import { Note } from '@/types/note';
import { FocusSession, SessionStats } from '@/types/focus-session';
import { TaskStats } from '@/types/task';

export interface DashboardStats {
  tasks: TaskStats;
  notes: {
    recent: Note[];
  };
  sessions: {
    stats: SessionStats;
    recent: FocusSession[];
  };
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Task', 'Note', 'FocusSession'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
