import style from './Home.module.scss'
import { ReactComponent as DownOneIcon } from '../assets/down-one.svg'
import { ReactComponent as ChangeIcon } from '../assets/change.svg'

const Home = () => {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1 className={style.gameTitle}>Memetos</h1>
        <div className={style.localeContent}>
          <button className={style.localeButton}>RU<DownOneIcon /></button>
        </div>
      </div>

      <div className={style.content}>
        <div className={style.invitedMessage}> {/* optional invitation message */}
          <div className={style.invitedAvatar}></div>
          <span className={style.title}>ВАС ПРИГЛАСИЛИ В КОМНАТУ EVT</span>
        </div>

        <div className={style.avatar}>
          <button className={style.avatarChangeButton}><ChangeIcon /></button>
        </div>

        <div className={style.containerInput}>
          <span className={style.title}>ВЫБЕРИ МЕМ-АВУ И ПСЕВДОНИМ</span>
          <input className={style.inputName} type='text' />
        </div>

        <div className={style.containerLoginButton}>
          <button className={style.loginButton}>Войти через Discord</button>
          <button className={style.loginButton}>Войти анонимно</button>
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

export default Home
