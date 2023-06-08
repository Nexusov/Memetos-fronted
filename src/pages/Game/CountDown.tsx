import React from 'react'

import styles from './CountDown.module.scss'

interface Delay extends React.CSSProperties {
  '--delay': number
}

export const CountDown = () => {
  return (
    <div className={styles.countdown}>
      <span className={styles.number} style={{ '--delay': 0 } as Delay}>3</span>
      <span className={styles.number} style={{ '--delay': 1 } as Delay}>2</span>
      <span className={styles.number} style={{ '--delay': 2 } as Delay}>1</span>
    </div>
  )
}
