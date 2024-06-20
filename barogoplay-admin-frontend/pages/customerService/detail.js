import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import Layout from '@/components/Layout/Layout'
import { useState, useEffect } from 'react';
import Button from '@/components/Button/Button'
import Apis from '@/components/utils/Apis'
import ReactQuillContainer from '@/components/ReactQuill/ReactQuillContainer'
import LevelIcon from "@/components/LevelIcon/LevelIcon";
import styles from './customerService.module.scss'
import ElapsedTime from '@/components/ElapsedTime/ElapsedTime'
import ToggleBtn from '@/components/ToggleBtn/ToggleBtn'
import { useRouter } from 'next/router'


export default function CustomerServiceDetail(props) {
  const router = useRouter();
  const { detailId, customerServiceDetailData, customerServiceAnswerData } = props;
  console.log("고객센터 상세 Props", props)

  // ! 문의글 상태 변경 처리 여부 확인
  const answerStatusCheck = async () => {
    const qnaStatus = document.querySelector(`input[name="qnaStatus"]`).checked;
    const answerPutRes = await Apis.put(`/api/users/qnas/status`, { questionIds: [customerServiceDetailData.id], qnaStatus: qnaStatus ? "답변완료" : "대기중" })
    console.log("문의 답변 상태 변경 api", answerPutRes)

    if (answerPutRes.status === 200 && answerPutRes.data.status !== "error") {
      alert('문의 상태 변경이 완료되었습니다.')
    } else {
      alert('문의 상태 변경에 실패했습니다. 사유 : ' + answerPutRes.data.message)
    }
  }

  // ! 신규 답변하기
  const answerHandler = async () => {

    // ! 답변 내용 등록
    const content = document.querySelector(`.${styles.answerSetBox} .ql-editor`).innerHTML;
    if (content === "<p><br></p>" || content === "") {
      alert('답변 내용을 입력해주세요.')
      return;
    } else {
      // ! 문의글 상태 변경 처리 여부 확인 - 답변완료면 대기중으로 변경, 대기중이면 답변완료로 변경
      answerStatusCheck()

      // ! 답변 등록
      const answerPostRes = await Apis.post(`/api/users/qnas/${customerServiceDetailData.id}`, content)
      console.log("답변 등록 api", answerPostRes)
      if (answerPostRes.status === 200 && answerPostRes.data.status !== "error") {
        alert('답변이 완료되었습니다.')
        router.reload();
      } else {
        alert('답변이 실패했습니다. 사유 : ' + answerPostRes.data.message || '알수없음')
      }
    }

  }

  const [newMode, setNewMode] = useState(true);
  const [EditMode, setEditMode] = useState({});

  useEffect(() => {
    // ! 답변별 수정 모드 초기 설정ㅣ
    if (customerServiceAnswerData.content.length > 0) {
      setEditMode(Object.assign(...customerServiceAnswerData.content.map((item) => { return { [`answer_${item.id}`]: false } })))
    }
  }, [customerServiceAnswerData.content])


  // ! 답변 수정, 삭제
  const answerSet = async (type, id, detailId) => {
    const dummy = { ...EditMode };
    if (type === "edit") {
      dummy[`answer_${id}`] = !dummy[`answer_${id}`];
      setNewMode(!newMode)
      setEditMode(dummy)
    } else if (type === "delete") {
      if (confirm('정말 삭제하시겠습니까?')) {
        const answerDelRes = await Apis.delete(`/api/users/qnas/${detailId}/answers/${id}`)
        console.log("답변 삭제 api", answerDelRes)

        if (answerDelRes.status === 200 && answerDelRes.data.status !== "error") {
          alert('삭제가 완료되었습니다.')
          router.reload();
        } else {
          alert('삭제가 실패했습니다. 사유 : ' + answerDelRes.data.message || '알수없음')
        }
      }
    } else if (type === "editComplete") {
      // ! 답변 내용 수정 api 호출
      const editContent = document.querySelector(`.answer_${id} .ql-editor`).innerHTML;
      const editAnswerPutRes = await Apis.put(`/api/users/qnas/${detailId}/answers/${id}`, editContent)
      console.log("답변 수정 api", editAnswerPutRes)

      if (editAnswerPutRes.status === 200 && editAnswerPutRes.data.status !== "error") {
        answerStatusCheck() // ! 문의글 상태 변경 처리 여부 확인
        alert('수정이 완료되었습니다.')
        router.reload();
      } else {
        alert('수정이 실패했습니다. 사유 : ' + editAnswerPutRes.data.message || '알수없음')
      }
    }
  }




  return (
    <>
      <div className='basicBox'>
        <h2>문의 내역 상세</h2>
        <div className={styles.detailBox}>
          <div className={styles.headerBox}>
            <div className={styles.status + (customerServiceDetailData.postMeta.qnaStatus === "답변완료" ? ` ${styles.ing}` : "")}>
              {customerServiceDetailData.postMeta.qnaStatus}
            </div>
            <div className={styles.title}>{customerServiceDetailData.title}</div>
            <div>
              {customerServiceDetailData.authorNickname}
              <LevelIcon level={customerServiceDetailData.authorLevel}></LevelIcon>
            </div>
            <div className={styles.createdDate}>
              <ElapsedTime createdDate={customerServiceDetailData.createdDate} />
            </div>
          </div>
          <div className={styles.inquiryType}><span>문의항목</span>{customerServiceDetailData.postMeta.qnaCategory}</div>
          <ReactQuillContainer content={customerServiceDetailData.content} readOnly={true} />


          {customerServiceAnswerData && customerServiceAnswerData.content.length > 0 && (
            <div className={styles.answerList}>
              <h3>답변 목록 <span>최신순 정렬</span></h3>
              {customerServiceAnswerData.content.map((item, index) => {
                return (
                  <div key={index} className={styles.answerBox + ` answer_${item.id}`}>

                    {EditMode[`answer_` + item.id]
                      ? (
                        <>
                          <ReactQuillContainer className={styles.answerContent} content={item.content.replace('"', "").slice(0, -1).replace(/\\"/g, '"').replace(/&nbsp;/g, "").replace(/&nbsp;/g, "<br/>")} />
                          <ToggleBtn
                            label="답변 완료 처리 여부"
                            name="qnaStatus"
                            defaultChecked={customerServiceDetailData.postMeta.qnaStatus === "답변완료" ? true : false}
                          />
                          {
                            item.deleted
                              ? <p className={styles.delComment}>삭제된 답변입니다.</p>
                              : (
                                <div className={styles.buttonBox}>
                                  <Button variantStyle="color" sizeStyle="sm" onClick={() => answerSet("edit", item.id, detailId)}>수정 취소</Button>
                                  <Button variantStyle="darkgray" sizeStyle="sm" onClick={() => answerSet("editComplete", item.id, detailId)}>수정 완료</Button>
                                </div>
                              )
                          }

                        </>
                      )
                      : (
                        <>
                          <div className={styles.answerTitle}>라이더플레이 답변</div>
                          <div className={styles.answerAuthor}>{item.authorNickname}</div>
                          <div className={styles.answerDate}>{item.createdDate}</div>

                          {/* <div className={styles.answerContent_2 + " boardContent"} dangerouslySetInnerHTML={{ __html: item.content.replace('"', "").slice(0, -1).replace(/\\"/g, '"').replace(/&nbsp;/g, "<br/>") }}></div> */}
                          <ReactQuillContainer type="comment" content={item.content.replace('"', "").slice(0, -1).replace(/\\"/g, '"').replace(/&nbsp;/g, "<br/>")} readOnly={true} />
                          {
                            item.deleted
                              ? <p className={styles.delComment}>삭제된 답변입니다.</p>
                              : (
                                <div className={styles.buttonBox}>
                                  <Button variantStyle="color" sizeStyle="sm" onClick={() => answerSet("edit", item.id, detailId)}>수정</Button>
                                  <Button variantStyle="darkgray" sizeStyle="sm" onClick={() => answerSet("delete", item.id, detailId)}>삭제</Button>
                                </div>
                              )
                          }
                        </>
                      )
                    }
                  </div>
                )
              })
              }
            </div>
          )
          }
        </div>
      </div>
      {
        newMode && (
          <div className='basicBox'>
            <div className={styles.detailBox}>

              <div className={styles.answerSetBox}>
                <h3>신규 답변</h3>
                <ReactQuillContainer />
                <ToggleBtn
                  label="답변 완료 처리 여부"
                  name="qnaStatus"
                  defaultChecked={customerServiceDetailData.postMeta.qnaStatus === "답변완료" ? true : false}
                />
                <Button className={styles.answerBtn}
                  variantStyle="color"
                  sizeStyle="sm" onClick={() => answerHandler()}>신규 답변 저장</Button>
              </div>

            </div>
          </div>
        )
      }
    </>
  )
}

CustomerServiceDetail.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const { detailId } = context.query;

  const customerServiceDetailRes = await serverSideGetApi(`/api/boards/qna/posts/${detailId}`, accessToken, refreshToken, context);
  const customerServiceDetailData = await customerServiceDetailRes.data || [];

  const customerServiceAnswerRes = await serverSideGetApi(`/api/boards/qna/posts/${detailId}/comments`, accessToken, refreshToken, context);
  const customerServiceAnswerData = await customerServiceAnswerRes.data || [];

  return {
    props: {
      detailId,
      customerServiceDetailData,
      customerServiceAnswerData
    },
  };
}

