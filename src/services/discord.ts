import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { APIUser } from 'discord-api-types/v10'
import { RootStore } from '../redux/store'

export interface User {
  userId: string
  name: string
  avatarUrl: string
}

export const discordApi = createApi({
  reducerPath: 'discordApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://discord.com/api/v10',
    prepareHeaders (headers, api) {
      const token = (api.getState() as RootStore).auth.discordToken
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      return headers
    }
  }),

  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => '/users/@me',
      transformResponse: (discordUser: APIUser) => {
        const avatarUrl = discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUser.discriminator) % 5}.png`

        return {
          userId: discordUser.id,
          name: discordUser.username,
          avatarUrl
        }
      }
    })
  })
})

export const { useGetCurrentUserQuery } = discordApi
