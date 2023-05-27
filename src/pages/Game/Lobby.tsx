import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import style from './Lobby.module.scss'
import toast from 'react-hot-toast'

import { ReactComponent as Crown } from '../../assets/crown-three.svg'
import { ReactComponent as Delete } from '../../assets/delete-three.svg'
import { ReactComponent as Setting } from '../../assets/setting-two.svg'

import { User } from '../../services/discord'
import { LobbySettings, Player } from '../../services/game'
import { SettingsPopup } from './SettingsPopup'
import { ProfilePopup } from './ProfilePopup'
import { Loader } from '../../components/Loader/Loader'

interface UserProps extends User {
  isOwner?: boolean
  isKickable?: boolean
  onKick?: (userId: string) => void | Promise<void>
  openPopup: () => void
}

const UserItem = ({ name, avatarUrl, userId, isOwner, isKickable, onKick, openPopup }: UserProps) => {
  const kickHandler: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (!onKick || isOwner) return
    e.stopPropagation()
    await onKick(userId)
    toast.success(`${name} kicked!`, { icon: '😁', duration: 1500 })
  }

  const renderBadge = () => {
    if (isOwner) {
      return (
        <div className={style.containerForCrown}>
          <Crown className={style.sizeUserSvg} />
        </div>
      )
    }

    if (isKickable) {
      return (
        <button className={style.containerForUserSvgAction} onClick={kickHandler}>
          <Delete className={style.sizeUserSvg} />
        </button>
      )
    }
  }

  return (
    <div className={style.userContainer} onClick={openPopup}>
      <img className={style.userAvatar} src={avatarUrl} alt="" />
      <div className={style.userName}>{name}</div>
      {renderBadge()}
    </div>
  )
}

const GameDescription = () => {
  return (
    <>
      <div>
        <div className={style.title}>Memetos</div>
        <div className={style.podTitle}>ПОСОБИЕ ДЛЯ маршака</div>
      </div>
      <div className={style.containerImgAndDiscriptionRulesGameMemetos}>
        <img className={style.aboutImg} src="https://cdn.discordapp.com/attachments/1102533895708225636/1109611347580289144/GameRulesPEPE.webp" alt="" />
        <div className={style.conteinerDiscription}>
          На экране появляется шутка. Каждый игрок выбирает <span style={{ color: '#B66DFF' }}>мем-картинку</span> из своей колоды. Затем среди всех участников проводится голосование за самый смешной <span style={{ color: '#B66DFF' }}>мем</span>, который лучше всего подходит к ситуации. <br /><br />
          Каждый голос равен одному <span style={{ color: '#EDE6AB' }}>мем-поинту</span>
        </div>
      </div>
    </>
  )
}

interface LobbyProps {
  players: Player[]
  isOwner: boolean
  ownerId: string
  settings: LobbySettings
  invite: string

  onStart: () => void | Promise<void>
  onKick?: (userId: string) => void | Promise<void>
}

interface LobbySettingProps<T extends string | number | boolean> {
  name: string
  value: T
  icon?: React.ReactNode
}

export const LobbySetting = <T extends string | number | boolean>({ name, value }: LobbySettingProps<T>) => {
  const renderValue = () => {
    if (typeof value === 'boolean') {
      return <div><input type='checkbox' checked={value} /></div>
    }

    return <div>{value}</div>
  }
  return (
    <div className={style.settingsContainer}>
      <div className={style.infoContainer}>
        <div>{name}</div>
        {renderValue()}
      </div>
    </div>
  )
}

export const Lobby = ({
  players: users,
  ownerId,
  isOwner,
  settings,
  invite,
  onKick,
  onStart
}: LobbyProps) => {
  const copyInvite = () => {
    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(invite)
      toast.success('Code copied!', { duration: 1500 })
    }
  }

  const copyInviteUrl = () => {
    if ('clipboard' in navigator) {
      const url = new URL(`invite/${invite}`, location.origin)
      navigator.clipboard.writeText(url.toString())
      toast.success('Link copied!', { duration: 1500 })
    }
  }

  const [isPopupVisible, setPopupVisible] = useState(false)
  const [userForProfilePopup, setUserForProfilePopup] = useState<User>()

  const togglePopup = () => {
    setPopupVisible((open) => !open)
  }

  const toggleProfilePopup = (user?: User) => {
    setUserForProfilePopup(user)
  }

  return (
    <>
      {isPopupVisible && (
        createPortal(<SettingsPopup togglePopup={togglePopup} settings={settings} />, document.body)
      )}
      {userForProfilePopup && (
        createPortal(<ProfilePopup toggleProfilePopup={() => toggleProfilePopup()} user={userForProfilePopup} />, document.body)
      )}
      <div className={style.container}>
        <div className={style.column}>
          <GameDescription />
        </div>

        <div className={style.column}>
          <div>
            <div className={style.title}>Lobby</div>
            <div className={style.podTitle}>Чел. {users.length}/{settings.maximumUsers}</div>
          </div>
          <div className={style.containerForUserContainer}>
            {users.map((user) =>
              <UserItem
                key={user.userId}
                {...user}

                isOwner={user.userId === ownerId}
                isKickable={user.userId !== ownerId && isOwner}
                openPopup={() => toggleProfilePopup(user)}
                onKick={onKick}
              />
            )}
          </div>
          {!isOwner && (
            <div className={style.inviteButtonContainer}>
              <button className={style.invite} onClick={copyInviteUrl}>Пригласить</button>
            </div>
          )}
        </div>

        <div className={style.column}>
          <div>
            <div>
              <div className={style.title}>Settings</div>
            </div>
            <div className={style.podTitle} onMouseDown={copyInvite}>Code: <span className={style.gameCode}>{invite}</span></div>
          </div>

          <div className={style.containerForSettingsContainer}>
            <LobbySetting
              name='Карт в колоде'
              value={settings.cardsCount}
            />
            <LobbySetting
              name='Время на выбор карт (секунд)'
              value={settings.chooseCardDuration}
            />
            <LobbySetting
              name='Время на голосование (секунд)'
              value={settings.voteDuration}
            />
            <LobbySetting
              name='Анонимное голосование'
              value={settings.isAnonymousVotes}
            />
            <LobbySetting
              name='Язык мемов'
              value={settings.language}
            />
            <LobbySetting
              name='Максимум игроков'
              value={settings.maximumUsers}
            />
          </div>

          <div className={style.conteinerButtonControlBlat}>
            {isOwner && (
              <div className={style.buttons}>
                <button className={style.settings} disabled={!isOwner} onClick={togglePopup}><Setting /></button>
                <button className={style.settings} onClick={copyInviteUrl}>Пригласить</button>
                <button className={style.start} disabled={!isOwner} onClick={onStart}>Начать</button>
              </div>
            )}

            {!isOwner && (
              <div className={style.waiting}>
                <div className={style.waitingText}>Ждём ведущего...</div>
                <Loader type='small' />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
