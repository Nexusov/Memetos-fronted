/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useRef, useState } from 'react'
import { ClientEvents, ServerEvents, gameActions } from '../../services/game'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootStore } from '../../redux/store'
import { useUser } from '../../hooks/useUser'
import { useSearchParams } from 'react-router-dom'

import { Lobby } from './Lobby'
import { Board } from './Board'

const transform = <T, >(data: string) => {
  return (JSON.parse(data) as unknown) as T
}

export const Game = () => {
  const socket = useRef<WebSocket>()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch<AppDispatch>()

  const [loading, setLoading] = useState(true)
  const { user, isLoading: isLoadingUser } = useUser()

  const settings = useSelector((state: RootStore) => state.game.settings)
  const gameStatus = useSelector((state: RootStore) => state.game.status)
  const players = useSelector((state: RootStore) => state.game.players)
  const ownerId = useSelector((state: RootStore) => state.game.ownerId)

  const isOwner = user.userId === ownerId

  useEffect(() => {
    if (isLoadingUser) return
    socket.current = new WebSocket('ws://localhost:3000/api/game/game')

    socket.current.addEventListener('open', () => {
      if (!socket.current) return

      socket.current.addEventListener('message', (event) => {
        const serverEvent = transform<ServerEvents>(event.data)

        switch (serverEvent.type) {
          case 'lobby_info': {
            dispatch(gameActions.lobbyInfo(serverEvent.data!))
            setLoading(false)
            break
          }
          case 'set_settings': {
            dispatch(gameActions.setSettings(serverEvent.data!))
            break
          }

          case 'player_join': {
            dispatch(gameActions.playerJoin(serverEvent.data!))
            break
          }
          case 'player_leave': {
            dispatch(gameActions.playerLeave(serverEvent.data!))
            break
          }

          case 'start_game': {
            dispatch(gameActions.startGame())
            break
          }
          case 'start_round': {
            dispatch(gameActions.startRound(serverEvent.data!))
            break
          }
          case 'start_voting': {
            dispatch(gameActions.startVoting())
            break
          }
          case 'vote_results': {
            dispatch(gameActions.endVoting(serverEvent.data!))
            break
          }
          case 'end_game': {
            dispatch(gameActions.endGame(serverEvent.data!))
            break
          }
          case 'cards_update': {
            dispatch(gameActions.cardsUpdate(serverEvent.data!))
            break
          }

          default: {
            // Ensure we catch every case
            const exhaustiveCheck: never = serverEvent
            throw new Error(exhaustiveCheck)
          }
        }
      })

      socket.current.send(
        JSON.stringify({
          type: 'connect',
          data: {
            ...user,
            inviteCode: searchParams.get('code')
          }
        } as ClientEvents)
      )
    })

    return () => {
      socket.current?.close()
    }
  }, [isLoadingUser])

  if (loading) {
    return (
      <h1>Загрузка</h1>
    )
  }

  const sendEvent = (event: ClientEvents) => {
    socket.current?.send(JSON.stringify(event))
  }

  switch (gameStatus) {
    case 'chooseCards':
    case 'voteCards':
    case 'voteResults': {
      return <Board />
    }

    case 'idle':
    case 'starting': {
      return (
        <Lobby
          players={players}
          ownerId={ownerId}
          isOwner={isOwner}
          onKick={(userId) => sendEvent({
            type: 'kick',
            data: {
              userId
            }
          })}
          settings={settings}
        />
      )
    }

    case 'end': {
      return <h1>Результаты игры</h1>
    }

    default: {
      // Ensure we catch every case
      const exhaustiveCheck: never = gameStatus
      throw new Error(exhaustiveCheck)
    }
  }

  if (gameStatus === 'starting') {
    return (
      <h1>1...2...3... Начало игры</h1>
    )
  }

  return (
    <div>
      Список игроков:

      <ul>
        {players.map((player) => (
          <li key={player.userId}>
            <img src={player.avatarUrl} />
            <span>{player.name}</span>

            {player.userId === ownerId && <span>Владелец игры</span>}
          </li>
        ))}
      </ul>

      {isOwner && <span>Вы можете выгонять людей, гы</span>}
    </div>
  )
}
