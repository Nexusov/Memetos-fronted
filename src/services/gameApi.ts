import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Player } from './game'

export const gameApi = createApi({
  reducerPath: 'gameApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/game'
  }),

  endpoints: (builder) => ({
    createLobby: builder.mutation<{ inviteCode: string }, Player['userId']>({
      query: (userId) => ({
        url: '/create',
        method: 'POST',
        body: {
          userId
        }
      })
    }),
    getLobbyInfo: builder.query<{ owner: Player, players: number, maxPlayers: number }, string>({
      query: (inviteCode) => ({
        url: '/create',
        method: 'GET',
        body: {
          inviteCode
        }
      })
    })
  })
})

export const { useCreateLobbyMutation, useGetLobbyInfoQuery } = gameApi
