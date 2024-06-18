

import Nav from '@/components/Nav/Nav'
import styles from './Layout.module.scss'
import PageDepthTitle from '@/components/PageDepthTitle/PageDepthTitle'

export default function Layout({ children }) {
  return (
    <div className={styles.layoutBox}>
      <Nav />
      <div className={styles.dummy}></div>
      <div className={styles.content}>
        <PageDepthTitle />
        {children}
      </div>
    </div>
  )
}

