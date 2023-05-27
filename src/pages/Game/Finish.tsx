import style from './Finish.module.scss'
import { LobbySettings, Player } from '../../services/game'

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

const PlayerItem = ({ avatarUrl, name, memePoints }: Player) => {
  return (
    <div className={style.userContainer}>
      <img className={style.userAvatar} src={avatarUrl} alt="" />
      <div className={style.icon}><Trophy /></div>
      <div className={style.userName}>{name}</div>
      <div className={style.containerPoints}>{memePoints} mp</div>
    </div>
  )
}

interface FinishProps {
  players: Player[]
  settings: LobbySettings
}

export const Finish = ({
  players,
  settings
}: FinishProps) => {
  const navigate = useNavigate()

  return (
    <div className={style.container}>
      <div className={style.columnUser}>
        <div>
          <div className={style.title}>Memetos</div>
          <div className={style.subTitle}>Чел. {players.length}/{settings.maximumUsers}</div>
        </div>

        <div className={style.userListContainer}>
          {players.map((player) => <PlayerItem key={player.userId} {...player} />)}
        </div>

        <div className={style.buttonContainer}>
          {/* TODO: make navigation to the Lobby, not at Home */}
          <button className={style.button} onClick={() => navigate('/')}>ВЕРНУТЬСЯ В ЛОББИ</button>
        </div>
      </div>

      <div className={style.column}>
        <div className={style.finalPageTitle}>
          ЛУЧШАЯ МЕМ КАРТА
        </div>
        <div className={style.bestCardAuthor}>
          {players.map((player) => <PlayerItem key={player.userId} {...player} />)}
        </div>
        <div className={style.joke}>
          Когда пришел на пару ну вы поняли и вообще маршак шашлык такой сочный вкусный шашлык что просто жесть а еще он дурак очень гулпый и не умеет играть в рассвет
        </div>
        <div className={style.containerCard}>
          <div className={style.bestCard}>
            {/* <img className={style.memeImg} src={pictureUrl} /> */}
            <img className={style.memeImg} src={'https://media.discordapp.net/attachments/704624285821435925/1110660123803779184/Screenshot_20210412-140741_Plants_vs_Zombies_FREE.png'} />
          </div>
        </div>
        <div className={style.bottomFinishTitle}>
          ОНА ПОНРАВИЛАСЬ 6 УЧАСТНИКАМ
        </div>
      </div>
    </div>
  )
}
