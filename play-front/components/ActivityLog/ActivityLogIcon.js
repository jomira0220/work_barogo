import { CumulativeCheeringIcon, BadgeCountIcon, DeliveryLankIcon } from '@/components/Icon/Icon'
import styles from './ActivityLog.module.scss'
import Link from 'next/link'

// 활동기록 아이콘 컴포넌트
export default function ActivityLogIcon(props) {
  let { profileData, type } = props;
  console.log("활동기록 아이콘 컴포넌트", profileData, type)

  const userLikeCount = profileData.userLikeCount === undefined || profileData.userLikeCount === null
    ? "0건"
    : `${Number(profileData.userLikeCount).toLocaleString('ko-kr')}건`;
  const badgeCount = profileData.badgeCount === undefined || profileData.badgeCount === null
    ? profileData.badgeAchievementCount
      ? `${Number(profileData.badgeAchievementCount).toLocaleString('ko-kr')}개`
      : "0건"
    : `${Number(profileData.badgeCount).toLocaleString('ko-kr')}개`;
  const seasonRanking = profileData.seasonRanking > 0 && profileData.seasonRanking !== undefined && profileData.seasonRanking !== null
    ? `${Number(profileData.seasonRanking).toLocaleString('ko-kr')}위`
    : "랭킹없음"

  const iconMenu = [
    { icon: <CumulativeCheeringIcon />, title: "누적 응원", data: userLikeCount, link: "/social/leaderBoard" },
    { icon: <BadgeCountIcon />, title: "달성 배지", data: badgeCount, link: "/activity/badge" },
    { icon: <DeliveryLankIcon />, title: "시즌 랭킹", data: seasonRanking, link: "/social/seasonRank" },
  ]

  return (
    <ul className={styles.myPerform}>
      {iconMenu.map((item, index) => {
        return (
          <li key={index}>
            {type
              ? ( //마이페이지에서만 링크 적용
                <Link href={item.link}>
                  {item.icon}
                  <div className={styles.numBox}>{item.data}</div>
                  <div>{item.title}</div>
                </Link>
              )
              : (
                <>
                  {item.icon}
                  <div className={styles.numBox}>{item.data}</div>
                  <div>{item.title}</div>
                </>
              )
            }
          </li>
        )
      })}
    </ul>
  )
}