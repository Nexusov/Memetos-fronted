import { FunctionComponent } from 'react'
import styles from './InviteAlert.module.scss'

import { Avatar } from '../Avatar/Avatar'

interface InviteAlertProps {
  inviter: string
  avatarUrl: string
}

export const InviteAlert: FunctionComponent<InviteAlertProps> = ({ inviter, avatarUrl }) => {
  return (
    <div className={styles.invite}>
      <Avatar avatarUrl={avatarUrl} size='small' />
      <span>Вы были приглашены в комнату {inviter}</span>
    </div>
  )
}
