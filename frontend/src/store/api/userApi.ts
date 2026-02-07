import { baseApi } from './baseApi';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  themePreference: string;
  createdAt: string;
  updatedAt: string;
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
  }),
});

export const { useGetProfileQuery, useUpdatePreferencesMutation } = userApi;
