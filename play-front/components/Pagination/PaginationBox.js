import styles from './PaginationBox.module.scss'
import { useState } from 'react';
import Pagination from 'react-js-pagination';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PaginationBox(props) {
  const router = useRouter();
  const { activePage, itemsCountPerPage, totalItemsCount, pageRangeDisplayed, pageType } = props;

  const [page, setPage] = useState(Number(activePage));

  useEffect(() => {
    setPage(Number(activePage));
  }, [activePage])

  const handlePageChange = (page) => {

    if (router.asPath.indexOf("?") === -1) {
      // ! 쿼리가 없는 상태인 경우
      router.replace(`${router.asPath}?${pageType || "page"}=${page - 1}`);
    } else {
      // ! 쿼리가 있는 상태인 경우
      const pagePath = router.asPath.split("?")[0]; // 쿼리 제거 후 페이지 경로만 가져오기
      const pageQuery = Object.fromEntries(new URLSearchParams(router.asPath.split("?")[1])) // url에 쿼리만 객체로 가져오기
      pageQuery[pageType || "page"] = page - 1
      router.replace(`${pagePath}?${new URLSearchParams(pageQuery).toString()}`);
    }

    setPage(page);
  };

  return (
    <>
      <div className={styles.pagination}>
        <Pagination
          activePage={page} //현재 페이지
          itemsCountPerPage={itemsCountPerPage} //한 페이지에 보여줄 아이템 개수
          totalItemsCount={totalItemsCount} //전체 아이템 개수
          pageRangeDisplayed={pageRangeDisplayed} //페이지 범위
          prevPageText={"‹"}
          nextPageText={"›"}
          onChange={handlePageChange} //페이지 클릭시 이벤트
        />
      </div>
    </>
  );
};

