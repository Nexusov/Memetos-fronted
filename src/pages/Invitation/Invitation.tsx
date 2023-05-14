import style from './Invitation.module.scss'

import { Button } from '../../components/Button/Button'
import { Footer } from '../../components/Footer/Footer'
import { Avatar } from '../../components/Avatar/Avatar'
import { InviteAlert } from '../../components/InviteAlert/InviteAlert'
import { Header } from '../../components/Header/Header'

import { currentName, inviterAvatar, inviterName, userAvatar } from '../../devConstants'

export const Invitation = () => {
  return (
    <div className={style.container}>
      <Header />

      <div className={style.content}>
        <InviteAlert avatarUrl={inviterAvatar} inviter={inviterName} />

        <div className={style.avatarContainer}>
          <Avatar avatarUrl={userAvatar} />
        </div>

        <span className={style.title}>ВЫ {currentName}</span>

        <div className={style.buttonContainer}>
          <Button>Войти в лобби</Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Invitation
