import style from './ProfilePopup.module.scss'
import { User } from '../../services/discord'
import { Avatar } from '../../components/Avatar/Avatar'

interface ProfilePopupProps {
  user: User
  toggleProfilePopup: () => void
}

export const ProfilePopup = ({ toggleProfilePopup, user }: ProfilePopupProps) => {
  return (
    <div className={style.container}>
      <div className={style.column}>
        <div>
          <div>
            <div className={style.title}>Profile</div>
          </div>
        </div>

        <div className={style.profileContainer}>
          <div className={style.userInfo}>
            <Avatar avatarUrl={user.avatarUrl} size='normal' />
            <div className={style.textContainer}>
              <div className={style.nickname}>{user.name}</div>
              <div className={style.premiumStatus}>PREMIUM STATUS: <div className={style.pepe}></div></div>
            </div>
          </div>

          <div className={style.statsContainer}>
            <div className={style.top1}>
              <div className={style.line}></div>
              <div className={style.statsText}>
                <div className={style.topTitle}>TOP 1</div>
                <div className={style.topCount}>3</div>
              </div>
            </div>

            <div className={style.top2}>
              <div className={style.line}></div>
              <div className={style.statsText}>
                <div className={style.topTitle}>TOP 2</div>
                <div className={style.topCount}>5</div>
              </div>
            </div>

            <div className={style.top3}>
              <div className={style.line}></div>
              <div className={style.statsText}>
                <div className={style.topTitle}>TOP 3</div>
                <div className={style.topCount}>0</div>
              </div>
            </div>

            <div className={style.total}>
              <div className={style.line}></div>
              <div className={style.statsText}>
                <div className={style.topTitle}>TOTAL</div>
                <div className={style.topCount}>21</div>
              </div>
            </div>
          </div>
        </div>

        <div className={style.buttonContainer}>
          <button className={style.closeButton} onClick={toggleProfilePopup}>Закрыть</button>
        </div>
      </div>
    </div>
  )
}
