import styles from './PaginationBox.module.scss'
import { useState, useEffect } from 'react';
import Pagination from 'react-js-pagination';
import { useRouter } from 'next/router';
import { queryString } from "@/components/utils/queryString";
import { separatePage } from "@/components/utils/separatePage";

export default function PaginationBox(props) {
  const router = useRouter();
  const { filterCategory, activePage, itemsCountPerPage, totalItemsCount, pageRangeDisplayed } = props;
  const [page, setPage] = useState(Number(activePage));


  useEffect(() => {
    setPage(Number(activePage));
  }, [activePage]);


  const handlePageChange = (page) => {
    if (
      (router.asPath.includes("?") === false) // 쿼리가 없는 경우
      || (router.asPath.includes("?") === true && router.asPath.split("?")[1] === "") // 물음표만 있는 경우
    ) {
      // ! 한페이지내에 페이징이 여러개인 경우를 걸러서 쿼리 수정
      // ! 쿼리가 아예 없거나 물음표만 있고 쿼리가 없는 상태인 경우
      separatePage.includes(filterCategory)
        ? router.push(`${router.pathname}?${filterCategory}Page=${page - 1}`)
        : router.push(`${router.pathname}?page=${page - 1}`)
    } else {
      // ! 쿼리가 있는 상태인 경우
      const pageQuery = router.query // url에 쿼리만 객체로 가져오기
      separatePage.includes(filterCategory)
        ? router.query[`${filterCategory}Page`] = page - 1
        : pageQuery.page = page - 1
      router.push(`${router.pathname}?${queryString(pageQuery)}`);
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
          onChange={(page) => handlePageChange(page)} //페이지 클릭시 이벤트
        />
      </div>
    </>
  );
};

