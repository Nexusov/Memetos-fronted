import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from './discord'

type GameStatus = 'idle' | 'starting' | 'chooseCards' | 'voteCards' | 'voteResults' | 'end'

export interface Player extends User {
  memePoints?: number
}

export interface Card {
  cardId: number
  pictureUrl: string
  userId: Player['userId']
  voters: Array<Player['userId']>
}

export interface LobbySettings {
  maximumUsers: number;
  roundsCount: number;
  cardsCount: number;
  voteDuration: number;
  chooseCardDuration: number;

  isNsfw: boolean;
  isAnonymousVotes: boolean;

  language: string;
}

export interface GameState {
  status: GameStatus
  settings: LobbySettings

  ownerId: string
  players: Player[]

  joke: string
  cards: Array<Card>
}

interface WebsocketMessage<T extends string = string, D = null> {
  type: T;
  data?: D;
}

export type ClientEvents =
  WebsocketMessage<'connect', Player & { inviteCode: string }> |
  WebsocketMessage<'disconnect'> |

  WebsocketMessage<'choose_card', { cardId: number }> |
  WebsocketMessage<'vote_card', { cardId: number }> |

  WebsocketMessage<'start'> |
  WebsocketMessage<'kick', Pick<Player, 'userId'>> |
  WebsocketMessage<'set_settings', Partial<LobbySettings>>

interface VoteResults {
  players: Required<Pick<Player, 'userId' | 'memePoints'>>[]
  cards: Pick<Card, 'cardId' | 'voters'>[]
}

export interface BestMeme {
  joke: string
  pictureUrl: string
  votes: number
  author: Player
}

export type ServerEvents =
  WebsocketMessage<'lobby_info', { settings: LobbySettings, players: Player[], ownerId: string }> |

  WebsocketMessage<'player_join', Player> |
  WebsocketMessage<'player_leave', Pick<Player, 'userId'>> |

  WebsocketMessage<'start_game'> |
  WebsocketMessage<'end_game', Required<Pick<Player, 'userId' | 'memePoints'>>[]> |
  WebsocketMessage<'best_meme', BestMeme> |

  WebsocketMessage<'start_round', { joke: string }> |
  WebsocketMessage<'cards_update', Pick<Card, 'userId' | 'cardId' | 'pictureUrl'>[]> |
  WebsocketMessage<'set_user_cards', Pick<Card, 'cardId' | 'pictureUrl'>[]> |

  WebsocketMessage<'start_voting'> |
  WebsocketMessage<'vote_results', VoteResults> |

  WebsocketMessage<'set_settings', Partial<LobbySettings>>

const initialState: GameState = {
  status: 'idle',

  ownerId: '',
  players: [],

  joke: '',
  cards: [],

  settings: {
    maximumUsers: 7,
    roundsCount: 3,
    cardsCount: 5,
    voteDuration: 30,
    chooseCardDuration: 60,
    isNsfw: false,
    isAnonymousVotes: false,
    language: 'ru'
  }
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    playerJoin (state, action: PayloadAction<Player>) {
      state.players.push(action.payload)
    },
    playerLeave (state, { payload: { userId } }: PayloadAction<Pick<Player, 'userId'>>) {
      state.players = state.players.filter((player) => player.userId !== userId)
    },

    lobbyInfo (state, action: PayloadAction<{ settings: LobbySettings, players: Player[], ownerId: Player['userId'] }>) {
      state.settings = action.payload.settings
      state.players = action.payload.players
      state.ownerId = action.payload.ownerId
    },

    startGame (state) {
      state.status = 'starting'
    },
    endGame (state, action: PayloadAction<Required<Pick<Player, 'userId' | 'memePoints'>>[]>) {
      for (const { userId, memePoints } of action.payload) {
        const playerIndex = state.players.findIndex((p) => p.userId === userId)
        if (playerIndex === -1) continue

        state.players[playerIndex].memePoints = memePoints
      }

      state.status = 'end'
    },

    startRound (state, action: PayloadAction<{ joke: string }>) {
      state.joke = action.payload.joke
      state.status = 'chooseCards'
      state.cards = []
    },
    cardsUpdate (state, action: PayloadAction<Pick<Card, 'userId' | 'cardId' | 'pictureUrl'>[]>) {
      state.cards = action.payload.map((card) => ({ ...card, voters: [] }))
    },
    startVoting (state) {
      state.status = 'voteCards'
    },
    endVoting (state, action: PayloadAction<VoteResults>) {
      for (const { userId, memePoints } of action.payload.players) {
        const playerIndex = state.players.findIndex((p) => p.userId === userId)
        if (playerIndex === -1) continue

        state.players[playerIndex].memePoints = memePoints
      }

      for (const { cardId, voters } of action.payload.cards) {
        const cardIndex = state.cards.findIndex((card) => card.cardId === cardId)
        if (cardIndex === -1) continue

        state.cards[cardIndex].voters = voters
      }

      state.status = 'voteResults'
    },

    setSettings (state, action: PayloadAction<Partial<LobbySettings>>) {
      state.settings = {
        ...state.settings,
        ...action.payload
      }
    },

    reset: () => initialState
  }
})

export const { actions: gameActions } = gameSlice
