import React from 'react'

import style from './Lobby.module.scss'

import { ReactComponent as DownOneIcon } from '../../assets/down-one.svg'
import { ReactComponent as Crown } from '../../assets/crown-three.svg'
import { ReactComponent as Delete } from '../../assets/delete-three.svg'
import { ReactComponent as Card } from '../../assets/card-two.svg'
import { ReactComponent as Setting } from '../../assets/setting-two.svg'

import { User } from '../../services/discord'
import { LobbySettings, Player } from '../../services/game'

interface UserProps extends User {
  isOwner?: boolean
  isKickable?: boolean
  onKick?: (userId: string) => void | Promise<void>
}

const UserItem = ({ name, avatarUrl, userId, isOwner, isKickable, onKick }: UserProps) => {
  const kickHandler = async () => {
    if (!onKick || isOwner) return
    await onKick(userId)
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
    <div className={style.userContainer}>
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
        <img className={style.aboutImg} src="https://media.discordapp.net/attachments/524230252084592641/1103749085455974480/image.png" alt="" />
        <div className={style.conteinerDiscription}>
          На экране появляется шутка. После чего каждый игрок выбирает мем-картинку из своей колоды. Затем среди всех участников проводится голосование за самый смешной мем, который лучше всего подходит к ситуации.
          Каждый голос равен одному мем-поинту
        </div>
      </div>
    </>
  )
}

interface LobbyProps {
  players: Player[]
  isOwner: boolean
  ownerId: string
  onKick?: (userId: string) => void | Promise<void>
  settings: LobbySettings
}

interface LobbySettingProps<T extends string | number | boolean> {
  name: string
  value: T
  icon?: React.ReactNode
}

const LobbySetting = <T extends string | number | boolean>({ name, value }: LobbySettingProps<T>) => {
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

export const Lobby = ({ players: users, ownerId, isOwner, onKick, settings }: LobbyProps) => {
  return (
    <div className={style.container}>
      <div className={style.column}>
        <GameDescription />
      </div>

      <div className={style.column}>
        <div>
          <div className={style.title}>Lobby</div>
          <div className={style.podTitle}>Чел. 1/7</div>
        </div>
        <div className={style.containerForUserContainer}>
          {users.map((user) =>
            <UserItem
              key={user.userId}
              {...user}

              isOwner={user.userId === ownerId}
              isKickable={user.userId !== ownerId && isOwner}
              onKick={onKick}
            />
          )}
        </div>
      </div>

      <div className={style.column}>
        <div>
          <div>
            <div className={style.title}>Settings</div>
          </div>
          <div className={style.podTitle}>OWNER: {users.find((player) => player.userId === ownerId)?.name}</div>
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
          <button className={style.settings}><Setting /></button>
          <button className={style.settings}>Пригласить</button>
          <button className={style.start}>Начать</button>
        </div>
      </div>
    </div>
  )
}
