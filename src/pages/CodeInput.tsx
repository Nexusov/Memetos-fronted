import { ReactComponent as DownOneIcon } from '../assets/down-one.svg'
import style from './CodeInput.module.scss'

const CodeInput = () => {
  return (
    <div className={style.container}>
      <div className={style.header}>
        <h1 className={style.gameTitle}>Memetos</h1>
        <div className={style.localeContent}>
          <button className={style.localeButton}>RU<DownOneIcon /></button>
        </div>
      </div>

      <div className={style.content}>
        <div className={style.outerInputContainer}>
          <div className={style.insideInputContainer}>
            <span className={style.title}>КОД</span>
            <input className={style.inputName} type='text' /></div>
        </div>

        <div className={style.buttonContainer}>
          <button className={style.loginButton}>НАЗАД</button>
          <button className={style.loginButton}>ВОЙТИ</button>
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

export default CodeInput
