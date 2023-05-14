import styles from './Link.module.scss'

import { FunctionComponent } from 'react'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'
import { Button } from '../Button/Button'

interface LinkProps extends RouterLinkProps {
  type?: 'button' | 'link'
}

export const Link: FunctionComponent<LinkProps> = ({ children, type = 'link', to, ...props }) => {
  if (type === 'button') {
    return (
      <RouterLink to={to} {...props}>
        <Button>
          {children}
        </Button>
      </RouterLink>
    )
  }

  return (
    <RouterLink className={styles.link} to={to} {...props}>
      {children}
    </RouterLink>
  )
}
