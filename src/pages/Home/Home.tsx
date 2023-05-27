import style from './Home.module.scss'

import { useNavigate } from 'react-router-dom'

import { ReactComponent as ChangeIcon } from '../../assets/change.svg'

import { Button } from '../../components/Button/Button'
import { Footer } from '../../components/Footer/Footer'
import { Avatar } from '../../components/Avatar/Avatar'
import { InviteAlert } from '../../components/InviteAlert/InviteAlert'
import { Header } from '../../components/Header/Header'

import { inviterAvatar, inviterName } from '../../devConstants'
import { useUser } from '../../hooks/useUser'
import { Loader } from '../../components/Loader/Loader'
import { useCreateLobbyMutation } from '../../services/gameApi'

const avatars: string[] = [
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101180013493112902/helpus.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101178601753280522/fy4bd2jQfPI.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101179298225848320/tZGkLpiqz6E.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101179234967375902/hr5bQdjRIa8.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101178210395365487/3eIoltWByjg.png'
]

const randomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)]

export const Home = () => {
  const { user, isLoading, isAnonymous, setName, setAvatar } = useUser()
  const [createLobby, { isLoading: isCreatingLobby }] = useCreateLobbyMutation()
  const navigate = useNavigate()
  const hasInvite = false

  if (isLoading || user === null) {
    return <Loader type='fullscreen'/>
  }

  const createLobbyHandler = async () => {
    const lobbyInfo = await createLobby(user.userId).unwrap()
      .catch(() => null)

    if (!lobbyInfo?.inviteCode) return
    navigate('/game', {
      state: lobbyInfo.inviteCode
    })
  }

  const renderProfile = () => {
    if (isAnonymous) {
      return (
        <>
          <Avatar avatarUrl={user.avatarUrl} size='normal'>
            <button className={style.avatarChangeButton} onClick={() => setAvatar(randomAvatar())}>
              <ChangeIcon />
            </button>
          </Avatar>

          <div className={style.containerInput}>
            <span className={style.title}>ВЫБЕРИ МЕМ-АВУ И ПСЕВДОНИМ</span>
            <input
              className={style.inputName}
              value={user.name}
              onChange={(e) => setName(e.target.value)}
              type='text'
              required
            />
          </div>
        </>
      )
    }

    return (
      <div className={style.profileContainer}>
        <Avatar avatarUrl={user.avatarUrl} size='normal' />

        <div className={style.textContainer}>
          <div className={style.nickname}>{user.name}</div>
          <div className={style.premiumStatus}>PREMIUM STATUS: <div className={style.pepe}></div></div>
        </div>
      </div>
    )
  }

  return (
    <div className={style.container}>
      <Header />

      <div className={style.content}>
        {hasInvite && <InviteAlert avatarUrl={inviterAvatar} inviter={inviterName} />}

        {renderProfile()}

        <div className={style.containerLoginButton}>
          <Button disabled={isCreatingLobby} onClick={createLobbyHandler}>Создать лобби</Button>
          <Button disabled={isCreatingLobby} onClick={() => navigate('/invite')}>Войти по коду</Button>
        </div>

        {isAnonymous && <div className={style.containerLoginButton}>
          <Button onClick={() => navigate('/auth/discord')}>Войти через Discord</Button>
        </div>}
      </div>

      <Footer />
    </div>
  )
}

export default Home
