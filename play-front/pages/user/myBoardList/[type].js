import PageTop from '@/components/PageTop/PageTop';
import LayoutBox from '@/components/LayoutBox/LayoutBox';
import PaginationBox from '@/components/Pagination/PaginationBox';
import styles from './MyBoardList.module.scss';
import Link from 'next/link';
import { getToken, serverSideGetApi } from '@/utils/serverSideGetApi';
import { useRouter } from 'next/router';
import ElapsedTime from '@/components/ElapsedTime/ElapsedTime';
import { loginCheck } from '@/utils/loginCheck';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function MyBoardList(props) {
  const router = useRouter();
  const { isLogin, myPostData, myCommentData, type, MyBoardData } = props;

  loginCheck(isLogin)

  const { totalElements, number, size } = MyBoardData ? MyBoardData : { totalElements: 0, number: 0, size: 0 };
  const boardCount = myPostData ? myPostData.totalElements : 0; //작성글 개수 api 연결
  const commentCount = myCommentData ? myCommentData.totalElements : 0; //댓글 개수 api 연결

  const [boardCheck, setBoardCheck] = useState(
    myCommentData.content.map((item) => {
      return false
    })
  )

  useEffect(() => {
    // 내가 작성한 댓글 삭제 여부 확인하여 true, false 반환
    if (type === "comments") {
      const boardCheckApiUrl = myCommentData.content.map((item) => {
        return axios.get(`${process.env.NEXT_PUBLIC_API_KEY}/api/boards/${item.boardCode}/posts/${item.postId}`);
      })
      axios.all(boardCheckApiUrl).then(
        axios.spread((...responses) => {
          const boardCheckData = responses.map((item) => {
            return item.data.status === "error" ? true : false
          })
          setBoardCheck(boardCheckData)
        })
      )
    }
  }, [myCommentData, type])

  console.log('MyBoardData', MyBoardData);

  if (isLogin === "true")
    return (
      <>
        <PageTop backPath="/user/myPage">작성글 · 댓글</PageTop>
        <ul className={styles.myBoardMenu}>
          <li className={type === "posts" ? styles.active : ""}><Link href="/user/myBoardList/posts"><div className={styles.countBox}>{boardCount}</div> 작성글</Link></li>
          <li className={type === "comments" ? styles.active : ""}><Link href="/user/myBoardList/comments"><div className={styles.countBox}>{commentCount}</div> 댓글</Link></li>
        </ul>
        {MyBoardData !== null && MyBoardData.content.length > 0 ? (
          <>
            <ul className={styles.myBoardList}>
              {MyBoardData.content.map((item, index) => {
                return (
                  <li key={index} className={type === "comments" && boardCheck[index] ? styles.boardRemoveComment : ""}>
                    {type === "comments" && boardCheck[index] ?
                      (
                        <>
                          <div className={styles.title}>{item.title || item.content.replace(/<br\s*\/?>/gi, " ").replace(/(<([^>]+)>)/ig, "")}</div>
                          <div className={styles.date}><ElapsedTime createdDate={item.createdDate} /></div>
                          <p>게시글이 삭제되었습니다</p>
                        </>
                      )
                      : (
                        <Link href={
                          type === "posts"
                            ? `/board/detail/${item.boardCode}/${item.id}`
                            : `/board/detail/${item.boardCode}/${item.postId}?targetId=${item.id}`
                        }>
                          <div className={styles.title}>{item.title || item.content.replace(/<br\s*\/?>/gi, " ").replace(/(<([^>]+)>)/ig, "")}</div>
                          <div className={styles.date}><ElapsedTime createdDate={item.createdDate} /></div>
                        </Link>
                      )
                    }
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
          <p className={styles.emptyBoard}>{type === "posts" ? "작성한 글" : "작성한 댓글"}이 없습니다</p>
        )
        }
      </>
    )
}

MyBoardList.getLayout = function getLayout(page) {
  return (<LayoutBox>{page}</LayoutBox>)
}

export const getServerSideProps = async (context) => {

  const { accessToken, refreshToken } = getToken(context);
  let { page: pageNum } = context.query;
  if (pageNum === undefined) pageNum = 0

  const type = context.params.type === "posts" ? "posts" : "comments"; //posts, comments 페이지 구분
  const myPostRes = await serverSideGetApi(`/api/users/me/posts?page=${pageNum}&size=10&sort=createdDate,desc`, accessToken, refreshToken, context);
  const myPostData = await myPostRes.status !== 'error' ? myPostRes.data : null;

  const myCommentRes = await serverSideGetApi(`/api/users/me/comments?page=${pageNum}&size=10&sort=createdDate,desc`, accessToken, refreshToken, context);
  const myCommentData = await myCommentRes ? myCommentRes.data : null;

  let MyBoardData = type === "posts" ? myPostData : myCommentData

  return {
    props: {
      myPostData,
      myCommentData,
      MyBoardData,
      type
    }
  }
}