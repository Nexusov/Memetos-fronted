import style from './CodeInput.module.scss'

import { Button } from '../../components/Button/Button'
import { Footer } from '../../components/Footer/Footer'
import { Header } from '../../components/Header/Header'

export const CodeInput = () => {
  return (
    <div className={style.container}>
      <Header />

      <div className={style.content}>
        <div className={style.outerInputContainer}>
          <div className={style.insideInputContainer}>
            <span className={style.title}>КОД</span>
            <input className={style.inputName} type='text' />
          </div>
        </div>

        <div className={style.buttonContainer}>
          <Button>НАЗАД</Button>
          <Button>ВОЙТИ</Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CodeInput
