
import LayoutBox from "@/components/LayoutBox/LayoutBox";
import PageTop from "@/components/PageTop/PageTop";
import { getToken, serverSideGetApi } from "@/utils/serverSideGetApi";
import PaginationBox from "@/components/Pagination/PaginationBox";
import ElapsedTime from '@/components/ElapsedTime/ElapsedTime';
import Link from 'next/link';
import styles from './systemNotice.module.scss';
import { useRouter } from "next/router";

export default function SystemNotice(props) {
  const router = useRouter();
  const { noticeData } = props;
  const { totalElements, number, size } = noticeData ? noticeData : { totalElements: 0, number: 0, size: 0 };
  console.log('시스템 공지 데이터', noticeData);

  return (
    <>
      <PageTop backPath="/user/myPage">플레이 운영 공지</PageTop>
      {(noticeData !== null && noticeData.totalElements > 0) ? (
        <>
          <ul className={styles.myBoardList}>
            {noticeData.content.map((item, index) => {
              return (
                <li key={index}>
                  <Link href={`/systemNotice/detail/${item.boardCode}/${item.id}`}>
                    <div className={styles.title}>{item.title || item.content}</div>
                    <div className={styles.date}><ElapsedTime createdDate={item.createdDate} /></div>
                  </Link>
                </li>
              )
            })}
          </ul>
          <PaginationBox
            pagePath={router.asPath}
            activePage={Number(number) + 1}
            itemsCountPerPage={size}
            totalItemsCount={totalElements}
            pageRangeDisplayed={5}
          />
        </>
      ) : (
        <p className={styles.emptyBoard}>공지가 없습니다</p>
      )
      }
    </>
  )
}

SystemNotice.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};


export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);
  const { page } = context.query;
  const noticeRes = await serverSideGetApi(`/api/boards/system/posts?page=${page || 0}&size=10&sort=createdDate,desc`, accessToken, refreshToken, context)
  const noticeData = await noticeRes.data || null;
  return {
    props: { noticeData }
  }
}