import styles from './SubNav.module.scss';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { NavList } from '@/components/Nav/NavSet'

export default function SubNav(props) {
  const router = useRouter();
  const asPath = router.asPath;
  const navPath = asPath.split("/")[1];
  const subNavPath = asPath.split("/")[2];
  const itemSet = NavList[navPath].filter(item => item.path === subNavPath)[0].subNav

  return (
    <ul className={styles.subNav}>
      {itemSet.map((item, index) => {
        return (
          <li key={index}>
            <Link
              className={asPath.includes(item.path) ? styles.active : ""}
              href={`/${navPath}/${subNavPath}/${item.path}`}>
              {item.title}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

