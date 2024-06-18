import Notice from "@/components/Notice/Notice";
import BoardList from "@/components/BoardList/BoardList";
import PaginationBox from "@/components/Pagination/PaginationBox";
import MarketingBanner from "@/components/MarketingBanner/MarketingBanner";
import RootLayout from "@/components/LayoutBox/RootLayout";
import styles from "./BoardPage.module.scss";
import Button from "@/components/Button/Button";
import { SearchIcon, PencilIcon } from "@/components/Icon/Icon";
import { useRouter } from "next/router";
import SearchBox from "@/components/SearchBox";
import { useState } from "react";
import { serverSideGetApi, getToken } from "@/utils/serverSideGetApi";
import BlockBoardPop from '@/components/BlockBoardPop';

//게시판
export default function BoardPage(props) {
  const router = useRouter();
  const { isLogin, data, boardNoticeData: noticeData, brandCheck } = props;
  const { content, number, totalElements, size } = data; //!게시글 데이터

  console.log("boardPage", props)

  const pageName = props.pageName || "hot"; //!게시판 이름

  // 글쓰기 불가능한 게시판
  const noWriteBoard = ["hot", "event", "benefit", "news"];

  //!검색 팝업 컨트롤
  const [searchPopup, setSearchPopup] = useState(false);

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
      />

      <MarketingBanner />
      {pageName !== "hot" && <Notice boardCode={pageName} noticeData={noticeData || []} />}

      {Number(totalElements) > 0 ? ( //게시글이 있을때만 노출
        <BoardList data={content} pageName={pageName} />
      ) : (
        <p className={styles.emptyText}>게시글이 없습니다.</p>
      )}

      <div className={styles.boardBtnBox}>

        {pageName !== "hot" && (
          <Button className={styles.searchBtn} variantStyle="color" sizeStyle="xs" onClick={() => setSearchPopup(true)}><SearchIcon /> 검색하기</Button>
        )}

        {!noWriteBoard.includes(pageName) && isLogin === "true" && (
          <Button
            className={styles.writeBtn} variantStyle="color" sizeStyle="xs"
            onClick={() => router.push(`/board/write/${pageName === "hot" ? "free" : pageName}`)}
          >
            <PencilIcon /> 글쓰기
          </Button>
        )}
      </div >

      {Number(totalElements) > 0 && ( //게시글이 있을때만 노출, hot에서는 비노출
        <PaginationBox
          activePage={number + 1}
          itemsCountPerPage={size}
          totalItemsCount={totalElements}
          pageRangeDisplayed={5}
        ></PaginationBox>
      )}
    </>
  );
}

BoardPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export const getServerSideProps = async (context) => {
  let {
    boardPage: pageName,
    searchType,
    searchKeyword,
    ongoing,
    page: pageNum,
  } = context.query;

  pageName = pageName[0] || "hot";
  pageNum = Number(pageNum) || 0;
  searchType = searchType || "titleOrContent";

  // 게시글 검색시 조건 : 제목+내용(기본 조건), 제목, 내용, 닉네임, 해시태그
  // titleOrContent, title, content, nickname, hashtag
  searchKeyword = searchKeyword || "";
  ongoing = ongoing || true;

  const pageSort =
    pageName === "hot"
      ? "hotTime,desc&sort=createdDate,desc"
      : "createdDate,desc";

  const { accessToken, refreshToken } = getToken(context);
  const boardPostRes = await serverSideGetApi(`/api/boards/${pageName}/posts?searchType=${searchType}&searchKeyword=${searchKeyword}&ongoing=${ongoing}&page=${pageNum}&size=10&sort=${pageSort}`, accessToken, refreshToken, context);
  const data = await boardPostRes.data || [];


  const boardNoticeRes = await serverSideGetApi(`/api/boards/${pageName}/notices?sort=createdDate,desc`, accessToken, refreshToken, context);
  const boardNoticeData = await boardNoticeRes.data || [];

  return { props: { data, pageName, boardNoticeData } };
};
