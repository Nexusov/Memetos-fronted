import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { DiscordToken } from '../types/authApi'
import { User, discordApi } from './discord'
import { randomAvatar } from '../devConstants'

interface AuthState {
  discordToken: string | null
  user: User | null

  status: 'init' | 'loading' | 'success' | 'error'
  error: string | null
}

interface RejectValue {
  message: string
}

const TOKEN_STORAGE_KEY = 'token'

const initialState: AuthState = {
  discordToken: localStorage.getItem(TOKEN_STORAGE_KEY),
  user: null,

  status: 'init',
  error: null
}

const generateUserId = (length = 9): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength = characters.length

  return Array(length).fill(null).map(
    () => characters.at(Math.floor(Math.random() * charactersLength))
  ).join('')
}

export const getDiscordToken = createAsyncThunk<DiscordToken, string>(
  'auth/getDiscordToken',
  async (code, { rejectWithValue }) => {
    const response = await fetch('/api/auth/discord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })

    if (!response.ok) {
      const error = await response.text()
      return rejectWithValue({ message: error } as RejectValue)
    }

    const payload = await response.json() as DiscordToken
    localStorage.setItem(TOKEN_STORAGE_KEY, payload.accessToken)

    return payload
  }
)

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser (state, action: PayloadAction<Partial<Pick<User, 'avatarUrl' | 'name'>>>) {
      if (state.user === null) return
      state.user = {
        ...state.user,
        ...action.payload
      }
    },
    logout (state) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      state.discordToken = null
      state.error = null
      state.status = 'success'
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getDiscordToken.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(getDiscordToken.fulfilled, (state, action) => {
        state.discordToken = action.payload.accessToken
        state.status = 'success'
        state.error = null
      })
      .addCase(getDiscordToken.rejected, (state, action) => {
        state.status = 'error'
        state.error = (action.payload as RejectValue).message
      })

    builder
      .addMatcher(discordApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.user = action.payload
      })
      .addMatcher(discordApi.endpoints.getCurrentUser.matchRejected, (state) => {
        if (state.user !== null) return

        state.user = {
          userId: generateUserId(),
          name: 'MemeCooler',
          avatarUrl: randomAvatar
        }
      })
  }
})

export const { actions: authActions } = authSlice
