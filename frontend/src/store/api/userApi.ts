import { baseApi } from './baseApi';

export interface TimerPreferences {
  defaultWorkDuration: number;
  defaultBreakDuration: number;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  themePreference: string;
  timerPreferences: TimerPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTimerPreferencesParams {
  defaultWorkDuration?: number;
  defaultBreakDuration?: number;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => '/users/me',
      providesTags: [{ type: 'User', id: 'PROFILE' }],
    }),
    updatePreferences: builder.mutation<
      UserProfile,
      { themePreference: string }
    >({
      query: body => ({
        url: '/users/preferences',
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'PROFILE' }],
    }),
    updateTimerPreferences: builder.mutation<
      UserProfile,
      UpdateTimerPreferencesParams
    >({
      query: preferences => ({
        url: '/users/me/timer-preferences',
        method: 'PATCH',
        body: preferences,
      }),
      invalidatesTags: [{ type: 'User', id: 'PROFILE' }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdatePreferencesMutation,
  useUpdateTimerPreferencesMutation,
} = userApi;
