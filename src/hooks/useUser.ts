import { useDispatch, useSelector } from 'react-redux'

import { User, useGetCurrentUserQuery } from '../services/discord'
import { authActions } from '../services/auth'
import type { AppDispatch, RootState } from '../redux/store'

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)

  const { data: discordUser, isFetching, isError, isLoading } = useGetCurrentUserQuery()
  const isAnonymous = !isFetching && (isError || !discordUser)

  const setUser = (user: Partial<Pick<User, 'avatarUrl' | 'name'>>) => {
    dispatch(authActions.setUser(user))
  }

  const setName = (name: string) => {
    setUser({ name })
  }

  const setAvatar = (avatarUrl: string) => {
    setUser({ avatarUrl })
  }

  return {
    user,
    setName,
    setAvatar,
    setUser,
    isLoading,
    isAnonymous
  }
}
