import styles from './Footer.module.scss'

import { Link } from '../Link/Link'

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Link to="https://discord.gg/dXT7seQdYD">DISCORD</Link>
      <span>/</span>
      <Link to="/tos">УСЛОВИЯ ИСПОЛЬЗОВАНИЯ</Link>
    </footer>
  )
}
