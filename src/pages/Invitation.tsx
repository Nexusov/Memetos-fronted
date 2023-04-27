import style from './Invitation.module.scss'
import { ReactComponent as DownOneIcon } from '../assets/down-one.svg'

const Invitation = () => {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1 className={style.gameTitle}>Memetos</h1>
        <div className={style.localeContent}>
          <button className={style.localeButton}>RU<DownOneIcon /></button>
        </div>
      </div>

      <div className={style.content}>
        <div className={style.invitedMessage}>
          <div className={style.invitedAvatar}></div>
          <span className={style.title}>ВАС ПРИГЛАСИЛИ В КОМНАТУ EVT</span>
        </div>

        <div className={style.avatarContainer}>
          <div className={style.avatar}></div>
        </div>

        <span className={style.title}>ВЫ EVT</span>

        <div className={style.buttonContainer}>
          <button className={style.joinButton}>Войти в лобби</button>
        </div>
      </div>

      <div className={style.footer}>
        <a href="" className={style.link}>Discord</a>
        <span>/</span>
        <a href="" className={style.link}>TERMS OF SERVICE</a>
      </div>
    </div>
  )
}

export default Invitation
