import style from './Board.module.scss'
import { Card, LobbySettings, Player } from '../../services/game'
import { useEffect, useState } from 'react'

const PlayerItem = ({ avatarUrl, name, memePoints }: Player) => {
  return (
    <div className={style.userContainer}>
      <img className={style.userAvatar} src={avatarUrl} alt="" />
      <div className={style.userName} data-mobile>{name}</div>
      <div className={style.containerPoints} data-mobile>{memePoints || 0} mp</div>
    </div>
  )
}

interface UserCardProps extends Pick<Card, 'pictureUrl'> {
  disabled: boolean
  isSelected?: boolean
  onSelect: () => void
}

const UserCard = ({ pictureUrl, onSelect, isSelected, disabled }: UserCardProps) => {
  const cx = isSelected ? `${style.myCard} ${style.selectedCard}` : style.myCard
  const cx2 = disabled ? `${cx} ${style.disabled}` : cx

  return (
    <div className={cx2} onClick={onSelect}>
      <img className={style.memeImg} src={pictureUrl} />
    </div>
  )
}

interface BoardCardProps extends Pick<Card, 'pictureUrl'> {
  disabled: boolean
  hidePicture?: boolean

  showAuthor?: boolean
  author?: Player

  onVote: () => void
  isVoted: boolean
  voters?: Player[]
}

const BoardCard = ({
  disabled,
  hidePicture,
  pictureUrl,
  onVote,
  isVoted,
  voters,

  showAuthor,
  author
}: BoardCardProps) => {
  if (hidePicture) {
    return (
      <div className={style.containerCard}>
        <div className={style.turnCard}>
          <div className={style.yourTurnText}>
            MEME
          </div>
        </div>
      </div>
    )
  }

  const cx = isVoted ? `${style.userTurnCard} ${style.selectedCard}` : style.userTurnCard
  const cx2 = disabled ? `${cx} ${style.disabled}` : cx

  return (
    <div className={style.containerCard} onClick={onVote}>
      <div className={cx2}>
        <img className={style.memeImg} src={pictureUrl} />
      </div>

      {showAuthor && (
        <>
          <div className={style.authorName}>{author?.name}</div>
          <div className={style.userVotedPicsContainer}>
            {voters?.map((voter) =>
              <div className={style.userVotedPic} key={voter.userId}>
                <img src={voter.avatarUrl} />
              </div>
            )}
          </div>
          <div className={style.memePoints}>MP: {voters?.length}</div>
        </>
      )}
    </div>
  )
}

interface BoardProps {
  state: 'chooseCards' | 'voteCards' | 'voteResults'
  players: Player[]
  settings: LobbySettings

  joke: string
  boardCards: Card[]
  voteCard: (cardId: number) => void
  votedCard?: Card

  cards: Pick<Card, 'pictureUrl' | 'cardId'>[]
  selectCard: (cardId: number) => void
  selectedCard?: Pick<Card, 'pictureUrl' | 'cardId'>
}

export const Board = ({
  state,
  players,
  settings,

  joke,
  boardCards,
  voteCard,
  votedCard,

  cards,
  selectCard,
  selectedCard
}: BoardProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(-1)

  useEffect(() => {
    if (state === 'chooseCards') {
      setTimeLeft(settings.chooseCardDuration)
    } else if (state === 'voteCards') {
      setTimeLeft(settings.voteDuration)
    } else if (state === 'voteResults') {
      setTimeLeft(5)
    }

    const timer = setInterval(() => {
      setTimeLeft((left) => left - 1)
    }, 1000)

    return () => {
      setTimeLeft((left) => left - 1)
      clearInterval(timer)
    }
  }, [state])

  const selectHandler = (cardid: number) => {
    if (state !== 'chooseCards') return
    selectCard(cardid)
  }

  const voteHandler = (cardId: number) => {
    if (state !== 'voteCards') return
    if (cardId === selectedCard?.cardId) return
    voteCard(cardId)
  }

  const renderTimer = () => {
    if (timeLeft < 0) return

    const timerName = state === 'chooseCards'
      ? 'Выбор карт'
      : state === 'voteCards'
        ? 'Голосование'
        : 'Итоги'

    return (
      <div className={style.timeStep}>
        <div>{timerName}</div>
        <div>{timeLeft} сек</div>
      </div>
    )
  }

  const renderMobileTimer = () => {
    if (timeLeft < 0) return

    const timerName = state === 'chooseCards'
      ? 'Выбор карт:'
      : state === 'voteCards'
        ? 'Голосование:'
        : 'Итоги:'

    return (
      <div className={style.mobileTimeStep}>
        <div>{timerName}</div>
        <div>{timeLeft} сек</div>
      </div>
    )
  }

  return (
    <div className={style.container}>
      <div className={style.columnUser}>
        <div>
          <div className={style.title}>Memetos</div>
          <div className={style.podTitle}>Чел. {players.length}/{settings.maximumUsers}</div>
        </div>

        <div className={style.containerForUserContainer}>
          {players.map((player) => <PlayerItem key={player.userId} {...player} />)}
        </div>
      </div>

      <div className={style.column}>
        <div className={style.conteinerDiscription}>
          {joke}
        </div>

        <div className={`${style.containerForHorizontal} ${style.boardCards}`}>
          {boardCards.map((card) =>
            <BoardCard
              disabled={state !== 'chooseCards' && card.cardId === selectedCard?.cardId}
              key={card.userId}
              pictureUrl={card.pictureUrl}
              hidePicture={state === 'chooseCards' && card.cardId !== selectedCard?.cardId}
              onVote={() => voteHandler(card.cardId)}
              showAuthor={state === 'voteResults'}
              author={players.find((player) => player.userId === card.userId)}
              isVoted={card.cardId === votedCard?.cardId}
              voters={card.voters.map((voter) => players.find((p) => p.userId === voter)!)}
            />
          )}
        </div>
        {renderMobileTimer()}

        <div className={style.containerForHorizontal}>
          <div className={style.myCardContainer}>
            {cards.map((card) =>
              <UserCard
                disabled={state !== 'chooseCards'}
                key={card.cardId}
                pictureUrl={card.pictureUrl}
                isSelected={card.cardId === selectedCard?.cardId}
                onSelect={() => selectHandler(card.cardId)}
              />
            )}
          </div>

          {renderTimer()}
        </div>
      </div>
    </div>
  )
}
