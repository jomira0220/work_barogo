import Link from 'next/link'
import { LineBasicArrow } from '@/components/Icon/Icon'
import { useRouter } from 'next/router';
import styles from './Nav.module.scss';
import Image from 'next/image'
import { NavList, NavTitle } from '@/components/Nav/NavSet'
import { deleteCookie } from 'cookies-next';

export default function Nav(props) {
  const router = useRouter();
  const Logout = async () => {
    deleteCookie("refreshToken");
    deleteCookie("accessToken");
    location.href = "https://auth.riderplay.co.kr/exit"
  }

  const NavItem = ({ title, navList, navTitle }) => {
    const active = title === router.pathname.split("/")[1] ? ` ${styles.active}` : ""
    const toggleNav = (e) => {
      e.currentTarget.classList.toggle(styles.active);
      e.currentTarget.nextElementSibling.classList.toggle(styles.active);
    }

    const activeStyle = title === (router.pathname).split("/")[1] ? styles.active : ""

    return (
      <>
        {navList[title].length === 1
          ? <Link className={activeStyle} href={`/${title}/`}>{navList[title][0].title}</Link>
          : (<>
            <div className={styles.toggleItem + active} onClick={(e) => toggleNav(e)}>
              {navTitle[title]} <span className={styles.toggleIcon}><LineBasicArrow /></span>
            </div>
            <ul className={styles.subNav + active}>
              {navList[title].map((item, index) => {
                // navList에 subNav가 있으면 subNav의 첫번째 path를 가져온 경로 적용
                const subNavPath = item.subNav ? item.subNav[0].path : '';
                const subActiveClass = router.pathname.includes(item.path) ? styles.active : ''
                const hrefPath = `/${title}/${item.path}/${subNavPath}`
                return (
                  <li key={index}><Link className={subActiveClass} href={hrefPath}>{item.title}</Link></li>
                )
              })}
            </ul>
          </>)
        }
      </>
    )
  };

  return (
    <div className={styles.navWrap}>
      <div className={styles.navInner}>
        <div>
          <h1 className={styles.mainLogo}>
            <Link href="/"><Image src="/images/logo_riderplay.png" alt="라이더플레이" width={170} height={25.5} fetchpriority="true" /></Link>
          </h1>
          <nav className={styles.mainNav}>
            {Object.keys(NavList).map((item, index) => {
              return (
                <li key={index}>
                  <NavItem title={item} navList={NavList} navTitle={NavTitle} />
                </li>
              )
            })}
          </nav>
        </div>
        <div className={styles.logoutBox}>
          <button className={styles.logoutBtn} type="button" onClick={() => Logout()}>로그아웃</button>
        </div>
      </div>
    </div>
  )
}



