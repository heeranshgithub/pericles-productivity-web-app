import { baseApi } from './baseApi';
import { Note, CreateNoteDto, UpdateNoteDto, NoteType } from '@/types/note';

export const notesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getNotes: builder.query<Note[], NoteType | undefined>({
      query: type => ({
        url: '/notes',
        params: type ? { type } : {},
      }),
      providesTags: result =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Note' as const, id: _id })),
              { type: 'Note', id: 'LIST' },
            ]
          : [{ type: 'Note', id: 'LIST' }],
    }),

    getRecentNotes: builder.query<Note[], void>({
      query: () => '/notes/recent',
      providesTags: [{ type: 'Note', id: 'RECENT' }],
    }),

    getNote: builder.query<Note, string>({
      query: id => `/notes/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Note', id }],
    }),

    createNote: builder.mutation<Note, CreateNoteDto>({
      query: data => ({
        url: '/notes',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [
        { type: 'Note', id: 'LIST' },
        { type: 'Note', id: 'RECENT' },
      ],
    }),

    updateNote: builder.mutation<Note, { id: string; data: UpdateNoteDto }>({
      query: ({ id, data }) => ({
        url: `/notes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Note', id },
        { type: 'Note', id: 'LIST' },
        { type: 'Note', id: 'RECENT' },
      ],
    }),

    deleteNote: builder.mutation<void, string>({
      query: id => ({
        url: `/notes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Note', id: 'LIST' },
        { type: 'Note', id: 'RECENT' },
      ],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetRecentNotesQuery,
  useGetNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = notesApi;
