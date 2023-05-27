import style from './CodeInput.module.scss'

import { ClipboardEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '../../components/Button/Button'
import { Footer } from '../../components/Footer/Footer'
import { Header } from '../../components/Header/Header'

import { useLazyGetLobbyInfoQuery } from '../../services/gameApi'
import toast from 'react-hot-toast'

export const CodeInput = () => {
  const [code, setCode] = useState('')
  const [getLobby, { isFetching }] = useLazyGetLobbyInfoQuery()

  const navigate = useNavigate()

  const joinLobby = async () => {
    const lobby = await getLobby(code).unwrap()
      .catch(() => null)

    if (lobby === null) {
      setCode('')
      toast.error('Lobby not found!', { duration: 1500 })
      return
    }

    if (lobby.players === lobby.maxPlayers) {
      setCode('')
      toast.error('Lobby is full!', { duration: 1500 })
      return
    }

    navigate('/game', {
      state: code
    })
  }

  const handleCodeChange = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const inputValue = e.clipboardData.getData('text')
    if (inputValue.includes(location.origin)) {
      setCode(inputValue.slice(-6))
    } else {
      setCode(inputValue)
    }
  }

  return (
    <div className={style.container}>
      <Header />

      <div className={style.content}>
        <div className={style.outerInputContainer}>
          <div className={style.insideInputContainer}>
            <span className={style.title}>КОД</span>
            <input
              className={style.inputName}
              value={code}
              onChange={(e) => setCode(e.currentTarget.value)}
              onPaste={handleCodeChange}
              type='text'
              disabled={isFetching}
              placeholder = 'Вставьте ссылку или код'
            />
          </div>
        </div>

        <div className={style.buttonContainer}>
          <Button onClick={() => navigate('/')} disabled={isFetching}>НАЗАД</Button>
          <Button onClick={joinLobby} disabled={isFetching}>ВОЙТИ</Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CodeInput
