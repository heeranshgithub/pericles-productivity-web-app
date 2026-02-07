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
      keepUnusedDataFor: 0,
      providesTags: [
        { type: 'Task', id: 'LIST' },
        { type: 'Task', id: 'STATS' },
        { type: 'Note', id: 'LIST' },
        { type: 'Note', id: 'RECENT' },
        { type: 'FocusSession', id: 'LIST' },
        { type: 'FocusSession', id: 'RECENT' },
        { type: 'FocusSession', id: 'STATS' },
      ],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
