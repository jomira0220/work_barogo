import LayoutBox from '@/components/LayoutBox/LayoutBox';
import PageTop from '@/components/PageTop/PageTop';
import Button from '@/components/Button/Button';
import styles from './NotificationList.module.scss';
import ElapsedTime from '@/components/ElapsedTime/ElapsedTime';
import { useState } from 'react';
import Modal from '@/components/Modal/Modal';
import { serverSideGetApi, getToken } from '@/utils/serverSideGetApi';
import Apis from '@/utils/Apis';
import { TextOverflow } from '@/utils/TextOverflow';
import { useRouter } from 'next/router';
import { ExpGiftIcon } from '@/components/Icon/Icon';


export default function NotificationList(props) {

    const { notification } = props;
    const [notificationData, setNotificationData] = useState(notification);
    const [modalOpened, setModalOpened] = useState({ onoff: false, point: 0 });
    const router = useRouter();
    console.log("알림 메세지", notification)

    // 컨펌데이트가 있으면 읽은 데이터 아니면 안읽은 데이터
    // 포인트 수령의 경우에는 읽기 api를 호출할 필요가 없음

    // 포인트 수령 팝업 오픈 및 포인트 수령 확인 처리
    const PointHandler = async (id, point) => {
        const res = await Apis.post(`/api/notifications/${id}/confirm`)
        console.log("포인트 수령 api", res)
        if (res.status === 200 && res.data.status === "success") {
            setModalOpened({ onoff: true, point: point });
            const newNotificationRes = await Apis.get(`/api/notifications/me`)
            const newNotificationData = await newNotificationRes.data.data;
            setNotificationData(newNotificationData) // 알림 목록 리프레시
        } else {
            alert(res.data.message)
        }
    };

    // 팝업 클로즈
    const HandleClose = () => {
        setModalOpened({ onoff: false, point: 0 });
        router.reload();
    };


    // 링크 클릭시 알림 확인 처리 및 링크 연결형인 경우 링크 이동
    const MessageConfirm = async (item, redirectUrl) => {
        const { id, type } = item;
        if (type !== "EVENT" && type !== "POINT") {
            // type을 확인하여 이벤트 게시판이 아니면 확인 완료 처리 및 링크 이동 처리
            const res = await Apis.post(`/api/notifications/${id}/confirm`)
            if (res.status === 200 && res.data.status === "success") {
                const newNotificationRes = await Apis.get(`/api/notifications/me`)
                const newNotificationData = await newNotificationRes.data.data;
                setNotificationData(newNotificationData)
                console.log("확인완료", newNotificationData)
            }
            router.push(redirectUrl)
        }
    }



    // 메시지 내용에 {{}}가 포함되어 있으면 해당 부분을 굵은 글씨로 표시한 형태로 반환
    const MessageTextViewSet = (message, index) => {
        const messageArr = message.split(" ")
        messageArr.map((item, i) => {
            if (item.includes("{{")) {
                const itemKey = item.replace("{{", "").replace("}}", "").replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, "")
                const itemKeyBack = item.replace("{{" + itemKey + "}}", "")
                const text = (notification[index].messageParams[itemKey] + itemKeyBack + (itemKeyBack && " ")).replace(/<br\s*\/?>/gi, " ").replace(/(<([^>]+)>)/ig, "")
                messageArr[i] = <b key={i}>{TextOverflow(text, 25)}</b>
            } else {
                messageArr[i] = item + " "
            }
        })
        return messageArr;
    }

    // 서브 타입에 따른 링크
    const subTypePath = {

        USER_LEVEL_UP: "/user/myPage", // 레벨업 안내
        USER_GIFT: "/user/gift", // 선물 안내

        ACHIEVEMENT_BADGE: "/activity/badge", // 뱃지 완료
        ACHIEVEMENT_CHALLENGE: "/activity/challenge", // 챌린지 완료

        FRIEND_REQUEST: "/social/friendRequest", // 친구요청
        FRIEND_APPROVED: "/social/leaderBoard", // 친구수락
        FRIEND_LIKE: "/social/leaderBoard", // 좋아요

        POST_COMMENT: "/board/detail/{{boardCode}}/{{postId}}", // 댓글
        POST_CHILD_COMMENT: "/board/detail/{{boardCode}}/{{postId}}", // 대댓글
        POST_HOT: "/board/detail/{{boardCode}}/{{postId}}", // 인기글 등록 안내
        POST_HIDDEN: "", // 숨김처리됨 안내
        POST_COMMENT_HIDDEN: "", // 숨김처리 댓글됨 안내

        USER_NICKNAME_BLOCKED: "", // 닉네임 차단 안내
        USER_COMMUNITY_BLOCKED: "", // 커뮤니티 차단 안내

        // MESSAGE: "/activity/badge", // 뱃지 완료
        // POINT: "/activity/challenge", // 챌린지 완료
    }

    // 메시지 타입에 따른 링크 연결 처리 작업
    const RedirectURL = (type, subTypePath, subType, redirectUrl, index) => {
        if (type === "GENERAL") {
            // 관리자페이지에서 관리자가 지정한 링크로 이동하는 경우
            return redirectUrl;
        } else if (type === "SYSTEM") {
            //  시스템 상에서 자동 전송되는 경우 타입에 따른 링크 연결 진행
            let typeUrl = subTypePath[subType]
            Object.keys(notification[index].messageParams).map((itemKey) => {
                // 댓글, 대댓글인 경우 해당 댓글 아이디를 포함한 링크로 이동
                if (itemKey === "commentId" || itemKey === "childrenCommentId") {
                    typeUrl += `?targetId=${notification[index].messageParams[itemKey]}`
                }
                return typeUrl = typeUrl.replace(`{{${itemKey}}}`, notification[index].messageParams[itemKey])
            });
            return typeUrl;
        }
    }


    // 모든 알림 읽음 처리 버튼 클릭시 
    const AllReadHandler = async () => {
        const MessageAllReadRes = await Apis.post(`/api/notifications/all/confirm`)
        console.log("알림 읽음 처리 api", MessageAllReadRes)
        if (MessageAllReadRes.status === 200 && MessageAllReadRes.data.status === "success") {
            const newNotificationRes = await Apis.get(`/api/notifications/me`)
            const newNotificationData = await newNotificationRes.data.data;
            setNotificationData(newNotificationData) // 알림 목록 리프레시
            console.log("모두 읽음")
        } else {
            console.log("모두 읽음 실패", MessageAllReadRes.data.message)
        }
    }


    return (
        <>
            {/* 경험치 지급 안내 팝업*/}
            {modalOpened.onoff && (
                <Modal className={styles.pointPopup} closePortal={() => HandleClose()}>
                    <div><ExpGiftIcon /></div>
                    <h5>{<b>{(modalOpened.point).toLocaleString("ko-KR")}EXP</b>} 지급 완료</h5>
                    <p>경험치 지급이 완료되었습니다.</p>
                    <Button variantStyle="color" sizeStyle="md" onClick={() => HandleClose()}>닫기</Button>
                </Modal>
            )}
            <PageTop backPath="/">알림 메세지 <button className={styles.allReadBtn} onClick={() => AllReadHandler()}>모두 읽음</button></PageTop>
            <div className={styles.notificationWarp}>
                {notificationData && notificationData.length === 0
                    ? (<p className={styles.noData}>알림 내역이 없습니다.</p>)
                    : (<ul className={styles.notificationList}>
                        {
                            notificationData.map((item, index) => {
                                return (
                                    <li key={item.id} className={item.confirmDate !== null ? styles.read : ""}>
                                        <div onClick={() => item.subType !== "POINT" && MessageConfirm(item, RedirectURL(item.type, subTypePath, item.subType, item.redirectUrl, index))}>
                                            <div className={styles.title}>{MessageTextViewSet(item.message, index)}</div>
                                            <div className={styles.date}><ElapsedTime createdDate={item.createdDate} /></div>
                                        </div>
                                        {item.subType === 'POINT' && (
                                            <Button className={styles.getPointBtn} variantStyle="color" sizeStyle="sm" onClick={() => PointHandler(item.id, item.point)}>확인</Button>
                                        )}
                                    </li>
                                )
                            })
                        }
                    </ul>)
                }
                {notificationData && notificationData.length > 0 && <p className={styles.infoText}>알림은 7일 이후 순차적으로 지워집니다.</p>}
            </div>
        </>
    )
}

NotificationList.getLayout = function getLayout(page) {
    return <LayoutBox>{page}</LayoutBox>;
};

export const getServerSideProps = async (context) => {
    const { accessToken, refreshToken } = getToken(context);
    //! 뒤에 아이디값 변수로 바꿔넣어야함
    const notificationsRes = await serverSideGetApi(`/api/notifications/me`, accessToken, refreshToken, context)
    const data = await notificationsRes.data;

    return {
        props: { notification: data }
    }

}