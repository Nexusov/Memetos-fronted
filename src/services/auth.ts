import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { DiscordToken } from '../types/authApi'

interface AuthState {
  discordToken: string | null
  status: 'init' | 'loading' | 'success' | 'error'
  error: string | null
}

interface RejectValue {
  message: string
}

const TOKEN_STORAGE_KEY = 'token'

const initialState: AuthState = {
  discordToken: localStorage.getItem(TOKEN_STORAGE_KEY),
  status: 'init',
  error: null
}

export const getDiscordToken = createAsyncThunk<DiscordToken, string>(
  'auth/getDiscordToken',
  async (code, { rejectWithValue }) => {
    const response = await fetch('http://localhost:3000/api/auth/discord', {
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
    logout: (state) => {
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
  }
})

export const { actions: authActions } = authSlice
