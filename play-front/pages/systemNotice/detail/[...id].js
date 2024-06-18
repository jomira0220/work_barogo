import LayoutBox from "@/components/LayoutBox/LayoutBox";
import PageTop from "@/components/PageTop/PageTop";
import styles from "./detail.module.scss";
import MarkertingBanner from "@/components/MarketingBanner/MarketingBanner";
import { useState, useEffect, useRef } from "react";
import ElapsedTime from "@/components/ElapsedTime/ElapsedTime";
import { useRouter } from "next/router";
import { getToken, serverSideGetApi } from "@/utils/serverSideGetApi";
import ReactQuillContainer from "@/components/ReactQuill/ReactQuillContainer";

export default function BoardDetail(props) {
  const router = useRouter();
  const { isLogin, detailData } = props;
  const bannerRef = useRef();
  const [bannerHeight, setBannerHeight] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setBannerHeight(bannerRef.current.offsetHeight + 50 + 100); // 광고배너높이  + 50은 상단 바 높이 + 100은 마진
    }, 500);
  }, [router, detailData]);

  return (
    <div className={styles.detailWarp}>
      <PageTop>시스템 공지 상세</PageTop>
      <div className={styles.boardDetailWrap}>
        <div className={styles.boardTop}>
          <h3 className={styles.boardTitle}>{detailData.title}</h3>
          <div className={styles.boardInfo}>
            <div className={styles.infoList}>
              <div className={styles.boardWriter}>
                {detailData.authorNickname}
              </div>
              <ul className={styles.infoData}>
                <li><ElapsedTime createdDate={detailData.createdDate} /></li>
                <li>조회 {detailData.viewCount.toLocaleString("ko-KR")}</li>
              </ul>
            </div>
          </div>
        </div>

        <ReactQuillContainer
          readOnly={true}
          content={detailData.content}
          style={{ minHeight: `calc(100vh - ${bannerHeight}px)` }}
        />

        <div ref={bannerRef}><MarkertingBanner /></div>
      </div>
    </div>
  );
}

BoardDetail.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);
  const { id } = context.query;

  const detailBoardName = id[0]; //게시판 이름
  const detailId = id[1]; //게시글 아이디

  const detailConRes = await serverSideGetApi(`/api/boards/${detailBoardName}/posts/${detailId}`, accessToken, refreshToken, context);
  const detailData = (await detailConRes.data) || null;

  return {
    props: {
      detailData,
    },
  };
};
