import style from './SettingsPopup.module.scss'
import { LobbySetting } from './Lobby'
import { LobbySettings } from '../../services/game'

interface SettingsPopupProps {
  settings: LobbySettings
  togglePopup: () => void
}

export const SettingsPopup = ({ togglePopup, settings }: SettingsPopupProps) => {
  return (
    <div className={style.container}>
      <div className={style.column}>
        <div>
          <div>
            <div className={style.title}>Settings</div>
          </div>
          <div className={style.subTitle}>Party time</div>
        </div>

        <div className={style.settingsContainer}>
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

        <div className={style.buttonContainer}>
          <button className={style.closeButton} onClick={togglePopup}>Закрыть</button>
        </div>
      </div>
    </div>
  )
}
