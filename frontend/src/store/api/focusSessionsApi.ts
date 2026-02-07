import { baseApi } from './baseApi';
import {
  FocusSession,
  SessionStats,
  StartSessionParams,
} from '@/types/focus-session';

export const focusSessionsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    startSession: builder.mutation<FocusSession, StartSessionParams | void>({
      query: (params) => ({
        url: '/focus-sessions/start',
        method: 'POST',
        body: params || {},
      }),
      invalidatesTags: [
        { type: 'FocusSession', id: 'ACTIVE' },
        { type: 'FocusSession', id: 'LIST' },
      ],
    }),

    endSession: builder.mutation<FocusSession, void>({
      query: () => ({
        url: '/focus-sessions/end',
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'FocusSession', id: 'ACTIVE' },
        { type: 'FocusSession', id: 'LIST' },
        { type: 'FocusSession', id: 'STATS' },
      ],
    }),

    getActiveSession: builder.query<FocusSession | null, void>({
      query: () => '/focus-sessions/active',
      providesTags: [{ type: 'FocusSession', id: 'ACTIVE' }],
    }),

    getAllSessions: builder.query<FocusSession[], void>({
      query: () => '/focus-sessions',
      providesTags: result =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: 'FocusSession' as const,
                id: _id,
              })),
              { type: 'FocusSession', id: 'LIST' },
            ]
          : [{ type: 'FocusSession', id: 'LIST' }],
    }),

    getRecentSessions: builder.query<FocusSession[], void>({
      query: () => '/focus-sessions/recent',
      providesTags: [{ type: 'FocusSession', id: 'RECENT' }],
    }),

    getSessionStats: builder.query<SessionStats, void>({
      query: () => '/focus-sessions/stats',
      providesTags: [{ type: 'FocusSession', id: 'STATS' }],
    }),

    deleteSession: builder.mutation<void, string>({
      query: id => ({
        url: `/focus-sessions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'FocusSession', id: 'LIST' },
        { type: 'FocusSession', id: 'STATS' },
      ],
    }),
  }),
});

export const {
  useStartSessionMutation,
  useEndSessionMutation,
  useGetActiveSessionQuery,
  useGetAllSessionsQuery,
  useGetRecentSessionsQuery,
  useGetSessionStatsQuery,
  useDeleteSessionMutation,
} = focusSessionsApi;
