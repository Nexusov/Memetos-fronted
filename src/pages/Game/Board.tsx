import style from './Board.module.scss'
import { Player } from '../../services/game'

const PlayerItem = ({ avatarUrl, name, memePoints }: Player) => {
  return (
    <div className={style.userContainer}>
      <img className={style.userAvatar} src={avatarUrl} alt="" />
      <div className={style.userName}>{name}</div>
      <div className={style.containerPoints}>{memePoints || 0}mp</div>
    </div>
  )
}

export const Board = () => {
  return (
    <div className={style.container}>
      <div className={style.columnUser}>
        <div>
          <div className={style.title}>Memetos</div>
          <div className={style.podTitle}>Чел. 1/7</div>
        </div>

        <div className={style.containerForUserContainer}>
          <PlayerItem
            name='Текст длинный'
            avatarUrl='https://media.discordapp.net/attachments/524230252084592641/1103753051417890958/image.png'
            userId='test123'
            memePoints={4}
          />
          <PlayerItem
            name='Текст длинный2'
            avatarUrl='https://media.discordapp.net/attachments/524230252084592641/1103753051417890958/image.png'
            userId='test1234'
            memePoints={2}
          />
        </div>
      </div>

      <div className={style.column}>
        <div className={style.conteinerDiscription}>
          На экране появляется шутка. После чего каждый игрок выбирает мем-картинку из своей колоды. Затем среди всех участников проводится голосование за самый смешной мем, который лучше всего подходит к ситуации.
          Каждый голос равен одному мем-поинту
        </div>

        <div className={style.containerForHorizontal}>
          <div className={style.containerCard}>
            <div className={style.turnCard}>
              <div className={style.yourTurnText}>
                your turn
              </div>
            </div>
            <div className={style.userCardName}>EvT</div>
          </div>
          <div className={style.containerCard}>
            <div className={style.userTurnCard}><img className={style.memeImg} src="https://media.discordapp.net/attachments/524230252084592641/1103753051417890958/image.png" alt="" /></div>
            <div className={style.userCardName}>EvT</div>
          </div>
        </div>

        <div className={style.containerForHorizontal}>
          <div className={style.myCardContainer}>
            <div className={style.myCard}><img className={style.memeImg} src="https://media.discordapp.net/attachments/524230252084592641/1103753051417890958/image.png" alt="" /></div>
            <div className={style.myCard}><img className={style.memeImg} src="https://media.discordapp.net/attachments/524230252084592641/1103753051417890958/image.png" alt="" /></div>
            <div className={style.myCard}><img className={style.memeImg} src="https://media.discordapp.net/attachments/524230252084592641/1103753051417890958/image.png" alt="" /></div>
            <div className={style.myCard}><img className={style.memeImg} src="https://media.discordapp.net/attachments/524230252084592641/1103753051417890958/image.png" alt="" /></div>
            <div className={style.myCard}><img className={style.memeImg} src="https://media.discordapp.net/attachments/524230252084592641/1103753051417890958/image.png" alt="" /></div>
            <div className={style.myCard}><img className={style.memeImg} src="https://media.discordapp.net/attachments/524230252084592641/1103753051417890958/image.png" alt="" /></div>
          </div>

          <div className={style.timeStep}>
            <img className={style.stepImg} src="https://media.discordapp.net/attachments/524230252084592641/1103753051417890958/image.png" alt="" />
            <div>ХОД</div>
            <div>EvT</div>
            <div>60сек</div>
          </div>
        </div>
      </div>
    </div>
  )
}
