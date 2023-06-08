import style from './Finish.module.scss'
import { BestMeme, LobbySettings, Player } from '../../services/game'

import { useNavigate } from 'react-router'

import { ReactComponent as Trophy } from '../../assets/trophy.svg'
import { ReactComponent as BlueMedal } from '../../assets/blue-medal.svg'
import { ReactComponent as BronzeMedal } from '../../assets/bronze-medal.svg'

// TODO: 1) Менять стиль игрока в списке, в зависимости от занятого места (только в СПИСКЕ!)

/*
  Цвета для смены цвета игрока в списке, в зависимости от места (бордер, весь текст, иконка):
    Первое место (желтый): #FFFBA3
    Второе место (голубой): #6BFFF6
    Третье место (Оранжевый): #CD7F32
    Остальные (Красный): #AE3939

    УВАГА! МОЖЕТ БЫТЬ НЕСКОЛЬКО ИГРОКОВ НА ОДНО МЕСТО!!!
*/

interface PlayerItemProps extends Player {
  place?: number
}

const PlayerItem = ({ avatarUrl, name, memePoints, place }: PlayerItemProps) => {
  const PlaceBadge = () => {
    switch (place) {
      case 1: {
        return <div className={style.icon}><Trophy /></div>
      }
      case 2: {
        return <div className={style.icon}><BlueMedal /></div>
      }
      case 3: {
        return <div className={style.icon}><BronzeMedal /></div>
      }
    }

    return null
  }

  return (
    <div className={style.userContainer}>
      <img className={style.userAvatar} src={avatarUrl} alt="" />
      <PlaceBadge />
      <div className={style.userName}>{name}</div>
      {memePoints !== undefined && <div className={style.containerPoints}>{memePoints} mp</div>}
    </div>
  )
}

interface FinishProps {
  players: Player[]
  settings: LobbySettings
  bestMeme?: BestMeme
}

export const Finish = ({
  players,
  settings,
  bestMeme
}: FinishProps) => {
  const navigate = useNavigate()
  const [one, two, three] = new Set(players.map(({ memePoints }) => memePoints!).sort((a, b) => b - a))

  const firstPlace = players.filter((p) => p.memePoints === one)
  const secondPlace = players.filter((p) => p.memePoints === two)
  const thirdPlace = players.filter((p) => p.memePoints === three)
  const otherPlayers = players.filter((p) => p.memePoints && p.memePoints < three)

  return (
    <div className={style.container}>
      <div className={style.columnUser}>
        <div>
          <div className={style.title}>Memetos</div>
          <div className={style.subTitle}>Чел. {players.length}/{settings.maximumUsers}</div>
        </div>

        <div className={style.userListContainer}>
          {firstPlace.map((player) => <PlayerItem key={player.userId} {...player} place={1} />)}
          {secondPlace.map((player) => <PlayerItem key={player.userId} {...player} place={2} />)}
          {thirdPlace.map((player) => <PlayerItem key={player.userId} {...player} place={3} />)}
          {otherPlayers.map((player) => <PlayerItem key={player.userId} {...player} />)}
        </div>

        <div className={style.buttonContainer}>
          {/* TODO: make navigation to the Lobby, not at Home */}
          <button className={style.button} onClick={() => navigate('/')}>ВЕРНУТЬСЯ В ЛОББИ</button>
        </div>
      </div>

      {bestMeme && (
        <div className={style.column}>
          <div className={style.finalPageTitle}>
            ЛУЧШАЯ МЕМ КАРТА
          </div>
          <div className={style.bestCardAuthor}>
            <PlayerItem {...bestMeme.author} />
          </div>
          <div className={style.joke}>
            {bestMeme.joke}
          </div>
          <div className={style.containerCard}>
            <div className={style.bestCard}>
              <img className={style.memeImg} src={bestMeme.pictureUrl} />
            </div>
          </div>
          <div className={style.bottomFinishTitle}>
            ОНА ПОНРАВИЛАСЬ {bestMeme.votes} УЧАСТНИКАМ
          </div>
        </div>
      )}
    </div>
  )
}
