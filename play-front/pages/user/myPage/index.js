import styles from './MyPage.module.scss'
import LayoutBox from '@/components/LayoutBox/LayoutBox'
import PageTop from '@/components/PageTop/PageTop'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getToken, serverSideGetApi } from '@/utils/serverSideGetApi'
import { CodeInputIcon, UserIcon, ListIcon, CustomerServiceIcon, VolumeLoudIcon, TermsofUseIcon, PointIcon } from '@/components/Icon/Icon'
import ActivityLevelInfo from '@/components/ActivityLog/ActivityLevelInfo'
import ActivityLogIcon from '@/components/ActivityLog/ActivityLogIcon'
import InfoDetailBtn from '@/components/InfoDetailBtn/InfoDetailBtn'
import Button from '@/components/Button/Button'


const MyPageMenu = [
    {
        title: '계정관리',
        icon: <UserIcon />,
        link: '/user/accountManagement'
    },
    {
        title: '경험치 획득 내역',
        icon: <PointIcon />,
        link: '/user/pointHistory'
    },
    // {
    //     title: '바로고몰 배송지 관리',
    //     icon: <DeliveryIcon />,
    //     link: '/user/deliveryList'
    // },
    {
        title: '작성글 · 댓글 관리',
        icon: <ListIcon />,
        link: '/user/myBoardList/posts'
    },
    {
        title: '추천 코드 등록',
        icon: <CodeInputIcon />,
        link: '/recommendCode'
    },
    {
        title: '고객센터',
        icon: <CustomerServiceIcon />,
        link: '/customerService' //'/board/customerCenter'
    },
    {
        title: '플레이 운영 공지',
        icon: <VolumeLoudIcon />,
        link: '/systemNotice'
    },
    {
        title: '이용약관 및 개인정보 취급방침',
        icon: <TermsofUseIcon />,
        link: '/termsOfUse'
    }
]


export default function MyPage(props) {

    const { isLogin, brandCheck, profileData, pointData } = props;
    console.log("마이페이지", props)

    const router = useRouter()

    // ! 라이더 레벨 그래프 클릭시 퍼센트 표시 노출
    const levelPerInfo = (e) => { e.currentTarget.classList.toggle(styles.active) }

    let leverPer = ((profileData.totalPoint - profileData.startPoint) / (profileData.endPoint - profileData.startPoint + 1) * 100).toFixed(1) // 레벨 퍼센트
    if (leverPer.charAt(leverPer.length - 1) === "0") { leverPer = leverPer.split(".")[0] } // 소수점이 0일때 소수점 제거
    const levelPointPer = leverPer + "%";
    const nextLevelPoint = profileData.totalPoint - profileData.startPoint // 다음 레벨까지 필요한 최소 경험치
    const levelPoint = profileData.endPoint - profileData.startPoint + 1; // 다음 레벨까지 필요한 최대 경험치 - 다음 레벨까지 필요한 최소 경험치 + 1 (다음 레벨까지 필요한 경험치)
    const totalPoint = profileData.totalPoint; // 나의 총 경험치


    if (isLogin === "true")
        return (
            <>
                <PageTop backPath="/">마이페이지</PageTop>
                <div className={styles.myinfo}>
                    {(brandCheck === null || brandCheck === "" || brandCheck === false) && (
                        <div className={styles.blurBox}>
                            <Button onClick={() => router.push("/user/riderPhoneNumber")}>라이더 계정 연동하기</Button>
                        </div>
                    )}
                    <InfoDetailBtn className={styles.infoBtn}>
                        <h5>마이페이지란?</h5>
                        <b>나의 티어와 계정 정보를 확인합니다. <br />높은 티어를 달성한 라이더님께 혜택을<br /> 드릴 수 있도록 다양한 이벤트를 준비 중입니다.</b>
                    </InfoDetailBtn>

                    <ActivityLevelInfo profileData={profileData} />

                    {/* <div className={styles.graphBar} onClick={(e) => levelPerInfo(e)}>
                        <span className={styles.pointInfo}>
                            다음 티어까지 <b> {(levelPoint - totalPoint).toLocaleString('ko-KR')}Exp </b> 남음
                        </span>

                        <span className={styles.barBg}>
                            <div className={styles.nextLevelImg} style={{ 'right': `calc(91% - ${levelPointPer})` }}>
                                <div className={styles.LevelImgInner}><span>{levelPointPer}</span></div>
                            </div>
                            <span className={styles.bar} style={{ "width": profileData.endPoint === profileData.totalPoint ? "100%" : levelPointPer }}></span>
                        </span>
                        <div className={styles.expInfoTop}>
                            <div>나의 경험치 <b>{totalPoint}Exp</b></div>
                            <div><span className='blind'>목표 경험치</span><b className={styles.nextExp}>{(levelPoint).toLocaleString('ko-kr')}Exp</b></div>
                        </div>
                    </div> */}

                    <div className={styles.graphBar} onClick={(e) => levelPerInfo(e)}>
                        <div className={styles.nextLevelImg} style={{ 'right': `calc(90% - ${levelPointPer})` }}>
                            <div className={styles.LevelImgInner}>
                                <span>{(nextLevelPoint).toLocaleString('ko-KR')}Exp</span>
                            </div>
                        </div>

                        <span className={styles.barBg}>
                            <span className={styles.bar}
                                style={{
                                    width: profileData.endPoint === profileData.totalPoint
                                        ? "100%"
                                        : levelPointPer
                                }}>
                            </span>
                            <b>{(levelPoint).toLocaleString('ko-kr')}Exp</b>
                        </span>
                        <span className={styles.pointInfo}>
                            나의 총 경험치 <b>{totalPoint !== null ? totalPoint : 0}Exp</b>
                        </span>
                    </div>

                    <div className={styles.roller}>
                        <div className={styles.rollText}>
                            <div>오늘 <b>{pointData.todayPoint ? (pointData.todayPoint).toLocaleString('ko-KR') : 0}Exp</b></div>
                            <div>시즌 <b>{pointData.todayPoint ? (pointData.seasonPoint).toLocaleString('ko-KR') : 0}Exp</b></div>
                        </div>
                    </div>
                    <ActivityLogIcon profileData={profileData} type="me" />
                </div>

                {MyPageMenu && MyPageMenu.length > 0 && (
                    <ul className={styles.mypageMenu}>
                        {MyPageMenu.map((item, index) => {
                            return (<li key={index}><Link href={item.link}>{item.icon}{item.title}</Link></li>)
                        })}
                    </ul>
                )}
            </>
        )
}

MyPage.getLayout = function getLayout(page) {
    return <LayoutBox>{page}</LayoutBox>;
};


export const getServerSideProps = async (context) => {
    const { accessToken, refreshToken } = getToken(context);

    if (!accessToken || !refreshToken) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const pointRes = await serverSideGetApi('/api/points', accessToken, refreshToken, context)
    const pointData = await pointRes.data || {};


    const profileRes = await serverSideGetApi('/api/users/me/info', accessToken, refreshToken, context)
    const profileData = await profileRes.data || {};
    return {
        props:
            { profileData, pointData }
    }
}

