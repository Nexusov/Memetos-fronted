import style from './Invitation.module.scss'
import { ReactComponent as ChangeIcon } from '../../assets/change.svg'

import { Button } from '../../components/Button/Button'
import { Footer } from '../../components/Footer/Footer'
import { Avatar } from '../../components/Avatar/Avatar'
import { InviteAlert } from '../../components/InviteAlert/InviteAlert'
import { Header } from '../../components/Header/Header'
import { Loader } from '../../components/Loader/Loader'

import { skipToken } from '@reduxjs/toolkit/query/react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { useGetLobbyInfoQuery } from '../../services/gameApi'

import toast from 'react-hot-toast'

const avatars: string[] = [
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101180013493112902/helpus.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101178601753280522/fy4bd2jQfPI.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101179298225848320/tZGkLpiqz6E.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101179234967375902/hr5bQdjRIa8.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101178210395365487/3eIoltWByjg.png'
]

const randomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)]

export const Invitation = () => {
  const { code } = useParams()
  const navigate = useNavigate()

  const { user, isAnonymous, isLoading: userLoading, setUser } = useUser()
  const { data: lobbyInfo, isLoading: lobbyLoading, isError } = useGetLobbyInfoQuery(code ?? skipToken)

  if (!code) {
    return <Navigate to='/invite' />
  }

  if (userLoading || lobbyLoading) {
    return <Loader type='fullscreen'/>
  }

  if (isError || !lobbyInfo) {
    toast.error('Error!', { duration: 1500 })
    return <Navigate to='/invite' />
  }

  // TODO: refactor to UserView and use as react component
  const renderUser = () => {
    if (!user) {
      return (
        <>
          Девиантное поведение приложения
        </>
      )
    }

    if (!isAnonymous) {
      return (
        <>
          <div className={style.avatarContainer}>
            <Avatar avatarUrl={user.avatarUrl} />
          </div>

          <span className={style.title}>ВЫ {user.name}</span>
        </>
      )
    }

    return (
      <>
        <Avatar avatarUrl={user.avatarUrl} size='normal'>
          <button className={style.avatarChangeButton} onClick={() => setUser({ avatarUrl: randomAvatar() })}>
            <ChangeIcon />
          </button>
        </Avatar>

        <div className={style.containerInput}>
          <span className={style.title}>ВЫБЕРИ МЕМ-АВУ И ПСЕВДОНИМ</span>
          <input
            className={style.inputName}
            value={user.name}
            onChange={(e) => setUser({ name: e.target.value })}
            type='text'
            required
          />
        </div>
      </>
    )
  }

  // TODO: check alert are working
  const enterLobby = () => {
    if (!lobbyInfo) {
      toast.error('Lobby not found!', { duration: 1500 })
      return
    }

    if (lobbyInfo.players === lobbyInfo.maxPlayers) {
      toast.error('Lobby is full!', { duration: 1500 })
      return
    }

    navigate('/game', {
      state: code
    })
  }

  return (
    <div className={style.container}>
      <Header />

      <div className={style.content}>
        <InviteAlert
          avatarUrl={lobbyInfo.owner.avatarUrl}
          inviter={lobbyInfo.owner.name}
        />

        {renderUser()}

        <div className={style.buttonContainer}>
          <Button onClick={enterLobby}>Войти в лобби</Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Invitation
