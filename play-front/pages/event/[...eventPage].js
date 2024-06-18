import RootLayout from "@/components/LayoutBox/RootLayout";
import styles from "./Event.module.scss";
import GalleryBoardList from "@/components/GalleryBoardList/GalleryBoardList";
import PaginationBox from "@/components/Pagination/PaginationBox";
import Link from "next/link";
import { serverSideGetApi, getToken } from "@/utils/serverSideGetApi";
import Button from "@/components/Button/Button";
import { SearchIcon } from "@/components/Icon/Icon";
import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import BlockBoardPop from '@/components/BlockBoardPop';

export default function Event(props) {

  const { pageName, pageType, data, brandCheck, isLogin } = props;
  const { totalElements, number, size, content } = data;

  //!검색 팝업 컨트롤
  const [searchPopup, setSearchPopup] = useState(false);

  const pageNameKo = { event: "이벤트", benefit: "혜택", news: "뉴스/공지", }

  return (
    <>
      {brandCheck === null && ( // 로그인하지 않았거나 브랜드가 없는 경우
        <BlockBoardPop isLogin={isLogin} />
      )}
      <SearchBox
        searchPopup={searchPopup}
        setSearchPopup={setSearchPopup}
        pageName={pageName}
        totalElements={totalElements}
        pageType={pageType}
      />

      <div className={styles.eventWrap + (pageName === "news" ? ` ${styles.news}` : "")}>
        {pageName !== "news" && (
          <ul className={styles.eventCate}>
            <li className={pageType ? styles.active : ""}>
              <Link href={`/event/${pageName}/ON`}>진행중인 {pageNameKo[pageName]}</Link>
            </li>
            <li className={pageType ? "" : styles.active}>
              <Link href={`/event/${pageName}/OFF`}>종료된 {pageNameKo[pageName]}</Link>
            </li>
          </ul>
        )}

        {data && totalElements === 0 ? (
          <div className={styles.empty}>등록된 글이 없습니다.</div>
        ) : (
          <>
            <GalleryBoardList data={content} type={pageType}></GalleryBoardList>
            <div className={styles.boardBtnBox}>
              <Button
                className={styles.searchBtn}
                variantStyle="color"
                sizeStyle="xs"
                onClick={() => setSearchPopup(true)}
              ><SearchIcon /> 검색하기
              </Button>
            </div>
            {Number(totalElements) > 0 ? ( //게시글이 있을때만 노출
              <PaginationBox
                pagePath={`board/${pageName}`}
                activePage={Number(number) + 1}
                itemsCountPerPage={size}
                totalItemsCount={totalElements}
                pageRangeDisplayed={5}
              ></PaginationBox>
            ) : null}
          </>
        )}
      </div >
    </>

  );
}

Event.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export const getServerSideProps = async (context) => {
  let { eventPage, searchType, searchKeyword, page } = context.query;

  // 뒤에 이벤트 진행 관련 파라미터가 없을 경우 - 이벤트 중인 첫번째 페이지 노출
  if (eventPage.length === 1) { eventPage.push("ON"); }

  const pageName = eventPage[0];
  const pageType = eventPage[1] === "ON" ? true : false; // 진행중인지 종료된지
  const pageNum = page !== undefined ? page : 0; // 페이지 번호

  searchType = searchType || "titleOrContent";
  searchKeyword = searchKeyword || "";

  const { accessToken, refreshToken } = getToken(context);
  const EventRes = await serverSideGetApi(
    `/api/boards/${pageName}/posts?searchType=${searchType}&searchKeyword=${searchKeyword}&ongoing=${pageType}&page=${pageNum}&size=5&sort=createdDate,desc`,
    accessToken, refreshToken, context
  );

  const data = await EventRes.data || {};

  return {
    props: { data, pageName, pageType },
  };
};
