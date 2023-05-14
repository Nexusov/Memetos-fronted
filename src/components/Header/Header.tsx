import styles from './Header.module.scss'

import { ReactComponent as DownOneIcon } from '../../assets/down-one.svg'

import { Button } from '../Button/Button'

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Memetos</h1>
      <div className={styles.language}>
        <Button>RU <DownOneIcon /></Button>
      </div>
    </header>
  )
}
