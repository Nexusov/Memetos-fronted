import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { getDiscordToken } from '../../services/auth'
import { AppDispatch, RootState } from '../../redux/store'

const authLink = 'https://discord.com/oauth2/authorize?client_id=1094675492981981214&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth%2Fdiscord&response_type=code&scope=identify%20email'

export const DiscordAuth = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { status, error } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const code = searchParams.get('code')
    if (code === null) {
      window.location.assign(authLink)
      return
    }

    const setupToken = async () => {
      const token = await dispatch(getDiscordToken(code)).unwrap()
        .then((response) => response.accessToken)
        .catch(() => null)

      if (token === null) {
        // TODO: show error alert
      }

      navigate('/')
    }

    setupToken()
  }, [])

  if (!searchParams.has('code')) {
    return <span>Переадресация на discord...</span>
  }

  if (status === 'error') {
    return <h1>Неизвестная ошибка: {error}</h1>
  }

  return <span>Работаем...</span>
}
