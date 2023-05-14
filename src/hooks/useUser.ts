import { useEffect, useState } from 'react'
import { User, useGetCurrentUserQuery } from '../services/discord'
import { randomAvatar } from '../devConstants'

const generateUserId = (length = 9): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charactersLength = characters.length

  return Array(length).fill(null).map(
    () => characters.at(Math.floor(Math.random() * charactersLength))
  ).join('')
}

export const useUser = () => {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState<User>(() => ({
    userId: generateUserId(),
    name: 'MemeCooler',
    avatarUrl: randomAvatar
  }))

  const { data: discordUser, isFetching, isError, isLoading } = useGetCurrentUserQuery()
  const isAnonymous = !isFetching && (isError || !discordUser)

  useEffect(() => {
    if (isFetching) return
    if (discordUser) {
      setUser(discordUser)
    }

    setInitializing(false)
  }, [discordUser, isFetching])

  const setName = (name: string) => {
    setUser((user) => ({ ...user, name }))
  }

  const setAvatar = (avatarUrl: string) => {
    setUser((user) => ({ ...user, avatarUrl }))
  }

  return {
    user,
    setName,
    setAvatar,
    isLoading: isLoading || initializing,
    isAnonymous
  }
}
