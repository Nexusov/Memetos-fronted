import styles from './404.module.scss'

import { Link } from '../../components/Link/Link'

export const NotFoundPage = () => {
  return (
    <div className={styles.notFound}>
      <img src='https://cdn.discordapp.com/attachments/561591566045544449/1103756352171544688/404.webp' className={styles.meme404} />
      <h1>Здесь ничего нет</h1>
      <p>Как вы вообще сюда попали?</p>

      <Link to='/' type='button'>
        Вернуться домой
      </Link>
    </div>
  )
}
