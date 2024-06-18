
import LayoutBox from "@/components/LayoutBox/LayoutBox";
import PageTop from "@/components/PageTop/PageTop";
import styles from "./../CustomerService.module.scss";
import { getToken, serverSideGetApi } from "@/utils/serverSideGetApi";
import ElapsedTime from "@/components/ElapsedTime/ElapsedTime";
import ReactQuillContainer from '@/components/ReactQuill/ReactQuillContainer';

export default function CustomerServiceDetail(props) {
  const { isLogin, qnaDetailData, qnaAnswerData } = props;
  console.log(qnaDetailData, qnaAnswerData)

  if (qnaDetailData !== null) {
    return (
      <>
        <PageTop backPath="/customerService/list">문의내역 상세</PageTop>
        <div className={styles.detailBox}>
          <div className={styles.headerBox}>
            <div className={styles.status + (qnaDetailData.postMeta.qnaStatus === '대기중' ? ` ${styles.ing}` : "")}>{qnaDetailData.postMeta.qnaStatus}</div>
            <div className={styles.title}>{qnaDetailData.title}</div>
            <div className={styles.createDate}><ElapsedTime createdDate={qnaDetailData.createdDate} /></div>
          </div>
          <div className={styles.inquiryType}><span>문의항목</span> {qnaDetailData.postMeta.qnaCategory}</div>
          <ReactQuillContainer readOnly={true} content={qnaDetailData.content} />

          <div className={styles.answerWrapBox}>
            {qnaAnswerData && qnaAnswerData.content.length > 0 &&
              qnaAnswerData.content.map((item, index) => {
                if (item.content === "삭제 처리된 댓글입니다") {
                  // 삭제 처리된 관리자 게시글은 보이지 않도록
                  return ("")
                } else {
                  return (
                    <div key={index} className={styles.answerBox}>
                      <div className={styles.answerTitle}>라이더플레이 답변</div>
                      <ReactQuillContainer
                        readOnly={true}
                        content={item.content.replace('"', "").slice(0, -1).replace(/\\"/g, '"').replace(/&nbsp;/g, "<br/>")}
                        type="comment"
                      />
                      <div className={styles.answerDate}><ElapsedTime createdDate={item.createdDate} /></div>
                    </div>
                  )
                }
              })
            }
          </div>
        </div>
      </>
    )
  }
}

CustomerServiceDetail.getLayout = function getLayout(page) {
  return (<LayoutBox>{page}</LayoutBox>);
};

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const { id } = context.query;
  const qnaDetailRes = await serverSideGetApi(`/api/users/me/qnas/${id}`, accessToken, refreshToken, context);
  const qnaDetailData = await qnaDetailRes.data || null;

  const qnaAnswerRes = await serverSideGetApi(`/api/users/me/qnas/${id}/answers`, accessToken, refreshToken, context);
  const qnaAnswerData = await qnaAnswerRes.data || null;


  return {
    props: {
      qnaDetailData,
      qnaAnswerData,
    }
  }
}