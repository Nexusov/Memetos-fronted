import { ReactComponent as DownOneIcon } from '../assets/down-one.svg'
import style from './AuthorizedPage.module.scss'

const AuthorizedPage = () => {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1 className={style.gameTitle}>Memetos</h1>
        <div className={style.localeContent}>
          <button className={style.localeButton}>RU<DownOneIcon /></button>
        </div>
      </div>

      <div className={style.content}>
        <div className={style.outerProfileContainer}>
          <div className={style.insideProfileContainer}>
            <div className={style.avatar}></div>
            <div className={style.textContainer}>
              <div className={style.nickname}>MARSHAK</div>
              <div className={style.premiumStatus}>PREMIUM STATUS: <div className={style.pepe}></div></div>
            </div>
          </div>
        </div>

        <div className={style.buttonContainer}>
          <button className={style.joinButton}>СОЗДАТЬ ЛОББИ</button>
          <button className={style.joinButton}>ВОЙТИ ПО КОДУ</button>
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

export default AuthorizedPage
