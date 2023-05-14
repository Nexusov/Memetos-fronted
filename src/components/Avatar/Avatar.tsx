import React from 'react'
import styles from './Avatar.module.scss'

interface AvatarProps {
  avatarUrl: string
  children?: React.ReactNode
  size?: 'small' | 'normal'
}

export const Avatar: React.FunctionComponent<AvatarProps> = ({ avatarUrl, children, size = 'normal' }) => {
  const className = `${styles.avatar} ${styles[size]}`

  return (
    <div
      className={className}
      style={{ backgroundImage: `url(${avatarUrl})` }}
    >
      {children}
    </div>
  )
}
