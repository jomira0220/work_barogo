
import PageTop from '@/components/PageTop/PageTop';
import styles from './../CustomerService.module.scss';
import LayoutBox from '@/components/LayoutBox/LayoutBox';
import { getToken, serverSideGetApi } from '@/utils/serverSideGetApi';
import Link from 'next/link';
import PaginationBox from "@/components/Pagination/PaginationBox";
import ElapsedTime from "@/components/ElapsedTime/ElapsedTime";
import CustomerServiceHeader from '@/components/CustomerServiceHeader';
import { PencilIcon } from "@/components/Icon/Icon";

export default function CustomerService(props) {
  const { isLogin, qnaListData } = props;
  if (isLogin === "true")
    return (
      <>
        <PageTop backPath="/user/myPage">고객센터</PageTop>
        <CustomerServiceHeader />

        <div className={styles.qnaListBox}>
          {qnaListData && (
            qnaListData.content.length === 0
              ? <div className={styles.empty}>문의내역이 없습니다.</div>
              : <ul className={styles.qnaList}>
                {qnaListData.content.map((item) => {
                  return (
                    <li key={item.id}>
                      <Link href={`/customerService/list/detail?id=${item.id}`}>
                        <div className={styles.status + (item.postMeta.qnaStatus === '대기중' ? ` ${styles.ing}` : "")}>{item.postMeta.qnaStatus}</div>
                        <div className={styles.title}>{item.title}</div>
                        <div className={styles.createDate}>
                          <ElapsedTime createdDate={item.createdDate} />
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
          )}

          <div className={styles.writeBtn}><Link href={"/customerService/write"}><PencilIcon /> 문의하기</Link></div>

          {qnaListData && Number(qnaListData.totalElements) > 0 && ( //댓글이 있을때만 노출
            <PaginationBox
              activePage={Number(qnaListData.number) + 1} //현재 페이지
              itemsCountPerPage={qnaListData.size} // 페이지당 게시글 수
              totalItemsCount={qnaListData.totalElements} // 전체 게시글 수
              pageRangeDisplayed={5} // 페이지네이션 범위
            />
          )}
        </div>
      </>
    );

};

CustomerService.getLayout = function getLayout(page) {
  return (
    <LayoutBox>
      {page}
    </LayoutBox>
  );
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context);
  const page = context.query.page || 0;
  console.log(page)
  if (!accessToken || !refreshToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const qnaRes = await serverSideGetApi(`/api/users/me/qnas?page=${page}&size=6&sort=createdDate,desc`, accessToken, refreshToken, context);
  const qnaListData = await qnaRes.data || null;

  return {
    props: { qnaListData }
  };
}