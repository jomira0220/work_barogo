import styles from './SocialInfo.module.scss';
import Image from 'next/image';
import Modal from '@/components/Modal/Modal';
import ActivityLevelInfo from '@/components/ActivityLog/ActivityLevelInfo';
import ActivityLogIcon from '@/components/ActivityLog/ActivityLogIcon';
import Button from '@/components/Button/Button';
import { useRouter } from 'next/router';

export default function SocialInfo(props) {
  const { friendInfo, setFriendInfo, userInfo, FriendDel } = props;
  const router = useRouter();
  console.log("친구정보", props)

  // !친구 정보 안내 팝업 닫기
  const CloseHandler = () => {
    setFriendInfo({ onoff: false, info: "" });
  };

  return (
    <>
      {/* 친구 클릭시 친구 정보 안내 팝업 */}
      {
        friendInfo.onoff && (
          <Modal closePortal={() => CloseHandler()} className={styles.friendMoreInfo}>
            {/* 친구 정보 혹은 나의 소셜 정보 */}
            {(friendInfo.info.userId !== userInfo.userId) && (router.asPath.indexOf("leaderBoard") !== -1)
              && (
                <Button
                  className={styles.friendDelBtn}
                  variantStyle="white"
                  onClick={() => {
                    FriendDel(
                      friendInfo.info.userId,
                      friendInfo.info.nickname
                    );
                    CloseHandler();
                  }}
                  sizeStyle="xs"
                >
                  친구 삭제
                </Button>
              )}
            <div className={styles.friendInfoInner}>
              <div className={styles.friendInfoTop}>
                <ActivityLevelInfo profileData={friendInfo.info} />
              </div>
              <div className={styles.friendBadgeBox}>
                <h4>대표 배지</h4>
                {friendInfo.info.representedBadgeList.length === 0 ? (
                  <p className={styles.empty}>등록된 대표 배지가 없습니다.</p>
                ) : (
                  <ul className={styles.badgeList}>
                    {friendInfo.info.representedBadgeList.map((item, index) => {
                      return (
                        <li key={index}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                            priority
                          />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <div className={styles.friendPerform}>
                <h4>활동 기록</h4>
                <ActivityLogIcon profileData={friendInfo.info} />
              </div>
              <Button
                className={styles.popClose}
                variantStyle="color"
                sizeStyle="lg"
                onClick={() => CloseHandler()}
              >
                닫기
              </Button>
            </div>
          </Modal>
        )
      }
    </>
  )
}