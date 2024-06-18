import styles from './PageDepthTitle.module.scss'
import { useRouter } from 'next/router'
import { NavTitle, NavList } from '@/components/Nav/NavSet'
import { daySet } from '@/components/utils/daySet'

export default function PageDepthTitle(props) {

  const router = useRouter();
  const pathname = router.pathname;
  const pathArr = pathname.split("/");
  const depth_1 = pathArr[1] || "member" // 기본값은 회원관리의 대시보드(메인 페이지)
  const depth_2 = pathArr[2] || "dashboard";
  const depth_3 = pathArr[3];

  const pageDepth = NavList[depth_1].filter(item => item.path === depth_2)[0]
    ? NavList[depth_1].filter(item => item.path === depth_2)[0]
    : NavList[depth_1][0];
  const pageTitle = pageDepth.subNav !== undefined
    ? pageDepth.subNav.filter(item => item.path === depth_3)[0]
      ? pageDepth.subNav.filter(item => item.path === depth_3)[0].title
      : null
    : pageDepth.title


  return (
    <div className={styles.pageDepthTitleWrap}>
      <div className={styles.pageDepth}>
        {NavTitle[depth_1] !== pageDepth.title && (
          <>
            {NavTitle[depth_1]}
            <span> / </span>
            {pageDepth.title}
          </>
        )}
        {pageDepth.title !== pageTitle && depth_3 && pageTitle && (
          <>
            <span> / </span>
            {pageTitle}
          </>
        )}
      </div>
      <h2 className={styles.pageTitle}>
        {pageDepth.title !== "대시보드"
          ? pathname.includes("detailId") ? "" : pageTitle
          : new Date(daySet(new Date(), 1)).toLocaleDateString()}
      </h2>
    </div>
  )
}