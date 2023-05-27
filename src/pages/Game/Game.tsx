/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import type { AppDispatch, RootState } from '../../redux/store'
import { Card, ClientEvents, ServerEvents, gameActions } from '../../services/game'
import { useUser } from '../../hooks/useUser'

import { Loader } from '../../components/Loader/Loader'

import { Lobby } from './Lobby'
import { Board } from './Board'
import { Finish } from './Finish'

const transform = <T, >(data: string) => {
  return (JSON.parse(data) as unknown) as T
}

export const Game = () => {
  const socket = useRef<WebSocket>()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const [userCards, setUserCards] = useState<Pick<Card, 'cardId' | 'pictureUrl'>[]>([])
  const [selectedCard, setSelectedCard] = useState<Pick<Card, 'cardId' | 'pictureUrl'>>()
  const [votedCard, setVotedCard] = useState<Card>()

  const [loading, setLoading] = useState(true)
  const { user, isLoading: isLoadingUser } = useUser()

  const settings = useSelector((state: RootState) => state.game.settings)
  const gameStatus = useSelector((state: RootState) => state.game.status)
  const players = useSelector((state: RootState) => state.game.players)
  const ownerId = useSelector((state: RootState) => state.game.ownerId)
  const boardCards = useSelector((state: RootState) => state.game.cards)
  const joke = useSelector((state: RootState) => state.game.joke)

  const inviteCode = location.state
  const isOwner = user?.userId === ownerId

  if (typeof inviteCode !== 'string') {
    return <Navigate to='/' />
  }

  useEffect(() => {
    if (isLoadingUser) return
    socket.current = new WebSocket('ws://localhost:3000/api/game/game')

    socket.current.addEventListener('open', () => {
      if (!socket.current) return
      dispatch(gameActions.reset())

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
            setSelectedCard(undefined)
            setVotedCard(undefined)

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
          case 'set_user_cards': {
            setUserCards(serverEvent.data!)
            break
          }

          default: {
            // Ensure we catch every case
            const exhaustiveCheck: never = serverEvent
            throw new Error(exhaustiveCheck)
          }
        }
      })

      socket.current.addEventListener('close', () => {
        navigate('/')
      })

      socket.current.send(
        JSON.stringify({
          type: 'connect',
          data: {
            ...user,
            inviteCode
          }
        } as ClientEvents)
      )
    })

    return () => {
      socket.current?.close()
    }
  }, [isLoadingUser])

  if (loading) {
    return <Loader />
  }

  const sendEvent = (event: ClientEvents) => {
    socket.current?.send(JSON.stringify(event))
  }

  const selectCard = (cardId: number) => {
    const card = userCards.find((card) => card.cardId === cardId)
    if (!card) return

    sendEvent({
      type: 'choose_card',
      data: { cardId }
    })
    setSelectedCard(card)
  }

  const voteCard = (cardId: number) => {
    const card = boardCards.find((card) => card.cardId === cardId)
    if (!card) return

    sendEvent({
      type: 'vote_card',
      data: { cardId }
    })
    setVotedCard(card)
  }

  switch (gameStatus) {
    case 'chooseCards':
    case 'voteCards':
    case 'voteResults': {
      return (
        <Board
          state={gameStatus}
          players={players}
          settings={settings}

          joke={joke}
          boardCards={boardCards}
          voteCard={voteCard}
          votedCard={votedCard}

          cards={userCards}
          selectCard={selectCard}
          selectedCard={selectedCard}
        />
      )
    }

    case 'idle':
    case 'starting': {
      return (
        <Lobby
          players={players}
          ownerId={ownerId}
          isOwner={isOwner}
          settings={settings}
          invite={inviteCode}

          onStart={() => sendEvent({ type: 'start' })}
          onKick={(userId) => sendEvent({
            type: 'kick',
            data: {
              userId
            }
          })}
        />
      )
    }

    case 'end': {
      return <Finish players={players}/>
    }

    default: {
      // Ensure we catch every case
      const exhaustiveCheck: never = gameStatus
      throw new Error(exhaustiveCheck)
    }
  }
}
