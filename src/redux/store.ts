import { configureStore } from '@reduxjs/toolkit'

import { authSlice } from '../services/auth'
import { discordApi } from '../services/discord'
import { gameSlice } from '../services/game'
import { gameApi } from '../services/gameApi'

export const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [gameSlice.name]: gameSlice.reducer,
    [gameApi.reducerPath]: gameApi.reducer,
    [discordApi.reducerPath]: discordApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        discordApi.middleware,
        gameApi.middleware
      )
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
