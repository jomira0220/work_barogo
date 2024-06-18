import Layout from "@/components/Layout/Layout";
import ReactQuillContainer from "@/components/ReactQuill/ReactQuillContainer";
import Button from "@/components/Button/Button";
import TagInputBox from "@/components/TagInputBox/TagInputBox";
import { VoteIcon, ImportantNoticeIcon } from "@/components/Icon/Icon";
import FileInput from '@/components/FileInput/FileInput';
import styles from "./edit.module.scss";
import { useState } from "react";
import { getToken, serverSideGetApi } from "@/components/utils/serverSideGetApi";
import { useRouter } from "next/router";
import Image from "next/image";
import ToggleBtn from "@/components/ToggleBtn/ToggleBtn";
import Apis from "@/components/utils/Apis";
import DatePickerBox from "@/components/DatePickerBox/DatePickerBox";
import SelectBox from "@/components/SelectBox/SelectBox";
import VoteSetBox from '@/components/VoteBox/VoteSetBox';
import { BoardEdit } from "@/components/utils/BoardEdit";

export default function BoardEditDetail(props) {
  const router = useRouter();
  const {
    boardName,
    postId,
    editPostData, // 원본 게시글 데이터
    editVoteData, // 원본 투표 데이터
    editTagData, // 원본 태그 데이터
    isLogin,
  } = props;

  console.log("관리자 게시판 게시글 상세", editVoteData);

  const [uploadImgUrl, setUploadImgUrl] = useState(editPostData.image); // 업로드한 이미지 url

  const [startDate, setStartDate] = useState(editPostData.postMeta.eventStartDate ? new Date(editPostData.postMeta.eventStartDate) : new Date());
  const [endDate, setEndDate] = useState(editPostData.postMeta.eventEndDate ? new Date(editPostData.postMeta.eventEndDate) : new Date());

  const [voteItemContent, setVoteItemContent] = useState(["", ""]); // !투표 항목 내용
  const [voteTitle, setVoteTitle] = useState("");// !투표 제목 


  // ! 모든 사용자에게 보이기 체크박스 체크시 다른 체크박스 해제
  // ! 또는 브랜드 선택시 모든 사용자에게 보이기 체크박스 해제
  const CheckChange = (e) => {
    const brandCheck = document.querySelectorAll(`.${styles.brandCheck} input:not(#conditionBrand_0)`);
    if (e.target.value === "ALL" && e.target.checked) {
      brandCheck.forEach((item) => {
        item.checked = false;
      });
    } else if (e.target.value !== "ALL") {
      document.querySelector("#conditionBrand_0").checked = false;
    }
  }

  const DeleteSubmit = async () => {
    const res = await Apis.delete(`/api/boards/${boardName}/posts/${postId}`);
    console.log("게시글 삭제 api 상태", res);
    if (res.status === 200 && res.data.status !== "error") {
      alert("게시글이 삭제되었습니다.");
      router.back()
    } else {
      alert("게시글 삭제에 실패했습니다.");
    }
  }

  // !기존 투표 삭제 여부
  const [delVoteData, setDelVoteData] = useState(false); // !기존 투표 삭제 여부


  const faqOptions = [
    { label: '커뮤니티', value: 'community' },
    { label: '활동기록', value: 'activity' },
    { label: '소셜', value: 'social' },
    { label: '선물', value: 'gift' },
    { label: '계정/연동', value: 'account' },
    { label: '기타', value: 'etc' },
  ]

  const boardKoName = { event: "이벤트", benefit: "제휴혜택", news: "뉴스/공지", faq: "FAQ" }


  if (isLogin === "true")
    return (
      <div className='basicBox'>
        <h2>{boardKoName[boardName]} 게시글 상세</h2>

        <div className={styles.boardWriteWrap}>
          {boardName !== "faq" && boardName !== "qna" && (
            <div className={styles.line}>
              <h5>업로드 된 이미지</h5>
              {uploadImgUrl ? <Image src={uploadImgUrl} width={300} height={200} alt={"이미지"} priority /> : <p>등록된 이미지가 없습니다.</p>}
              <span></span><FileInput name="Image" accept="image/png, image/jpeg" setUploadImgUrl={setUploadImgUrl} />
            </div>
          )}

          {/* QnA 항목 */}
          {boardName === "qna" && (
            <SelectBox
              options={[
                { value: "none", label: "문의항목을 선택해주세요." },
                { value: "불편사항개선", label: "불편 사항 개선 문의" },
                { value: "이벤트문의", label: "이벤트 문의" },
                { value: "오류문의", label: "오류 문의" },
                { value: "이용문의", label: "이용 문의" },
                { value: "기타문의", label: "기타 문의" }
              ]}
              defaultChecked={[
                { value: "불편사항개선", label: "불편 사항 개선 문의" }
              ]} />
          )}


          {/* faq 카테고리 */}
          {boardName === "faq" && (
            <div className={styles.line}>
              <h5>카테고리</h5>
              <SelectBox
                className={styles.selectBox + " " + styles.faqCategory}
                name="faqCategory"
                options={faqOptions}
                defaultValue={faqOptions.find((item) => item.value === editPostData.postMeta.faqCategory)}
              />
            </div>
          )}

          <div className={styles.line}>
            <h5>제목</h5>
            <input id="title" className={styles.writeTitle} type="text" placeholder="제목을 입력하세요." defaultValue={editPostData.title} />
          </div>

          <ReactQuillContainer content={editPostData.content} />

          {boardName !== "faq" && boardName !== "qna" && (
            <>
              {editVoteData !== null ? (
                !delVoteData ? (
                  // 투표 데이터가 있는 상태에서 투표 삭제 버튼을 누르기 전
                  <>
                    <div className={styles.boardVote}>
                      <h3>
                        <VoteIcon />
                        {editVoteData.voteName}
                      </h3>
                      <div className={styles.voteTotal}>
                        {Number(editVoteData.totalCount).toLocaleString(
                          "ko-KR"
                        )}
                        명 투표
                      </div>
                      <ul className={styles.boardVoteList}>
                        {editVoteData.voteDetailList.map((item, index) => {
                          const voteCount = item.count;
                          const votePercent =
                            editVoteData.totalCount === 0
                              ? 0
                              : Math.round(
                                (voteCount / editVoteData.totalCount) * 100
                              );
                          return (
                            <li
                              key={index}
                              className={item.isVoted ? styles.active : ""}
                            >
                              <div className={styles.voteBox}>
                                <span
                                  className={styles.percentBox}
                                  style={{ width: `${votePercent}%` }}
                                ></span>
                                <span className={styles.voteTitle}>
                                  {item.content}
                                </span>
                                <span className={styles.percent}>
                                  {votePercent}%
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className={styles.notEdit}>
                      <p>
                        <b><ImportantNoticeIcon /> 투표 수정 불가능</b>
                        <span>
                          기존 투표를 삭제한 후<br />
                          신규 투표 생성
                        </span>
                        이 가능합니다.
                      </p>
                      <Button sizeStyle="xs" variantStyle="darkgray" onClick={() => setDelVoteData(true)}>투표 삭제</Button>
                    </div>
                  </>
                ) : (
                  // 투표 데이터가 있는 상태에서 삭제 버튼을 누른 후
                  <VoteSetBox
                    delVoteData={true}
                    setDelVoteData={setDelVoteData}
                    voteItemContent={voteItemContent}
                    setVoteItemContent={setVoteItemContent}
                    voteTitle={voteTitle}
                    setVoteTitle={setVoteTitle}
                  />
                )
              ) : (
                // 투표 데이터가 없는 상태 (처음 투표 생성인 경우)
                <VoteSetBox
                  delVoteData={false}
                  setDelVoteData={setDelVoteData}
                  voteItemContent={voteItemContent}
                  setVoteItemContent={setVoteItemContent}
                  voteTitle={voteTitle}
                  setVoteTitle={setVoteTitle}
                />
              )}

              <div className={styles.line}>
                <h3>해시 태그</h3>
                <TagInputBox tagData={editTagData} />
              </div>

              {boardName !== "news" &&
                <div className={styles.line}>
                  <h3>이벤트 기간</h3>
                  <div className={styles.innerBox}>
                    <DatePickerBox
                      minDate={new Date()}
                      dateFormat='yyyy.MM.dd HH:mm'
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      showTimeInput
                    />
                    ~
                    <DatePickerBox
                      minDate={startDate}
                      dateFormat='yyyy.MM.dd HH:mm'
                      selected={startDate >= endDate ? startDate : endDate}
                      onChange={(date) => setEndDate(date)}
                      showTimeInput
                    />
                  </div>
                </div>
              }

              <div className={styles.line}>
                <h3>적용 브랜드</h3>
                <div className={styles.innerBox + " " + styles.brandCheck}>
                  <label htmlFor='conditionBrand_0'>
                    <input
                      type='checkbox'
                      id='conditionBrand_0'
                      name='conditionBrand'
                      defaultChecked={editPostData.postMeta.eventTargetCompany.includes('ALL')}
                      value='ALL'
                      onChange={(e) => CheckChange(e)}
                    />
                    전체 <span>*비회원 포함</span>
                  </label>
                  <label htmlFor='conditionBrand_1'>
                    <input
                      type='checkbox'
                      id='conditionBrand_1'
                      name='conditionBrand'
                      value='BAROGO'
                      defaultChecked={editPostData.postMeta.eventTargetCompany.includes('BAROGO')}
                      onChange={(e) => CheckChange(e)}
                    />
                    바로고
                  </label>
                  <label htmlFor='conditionBrand_2'>
                    <input
                      type='checkbox'
                      id='conditionBrand_2'
                      name='conditionBrand'
                      value='DEALVER'
                      defaultChecked={editPostData.postMeta.eventTargetCompany.includes('DEALVER')}
                      onChange={(e) => CheckChange(e)}
                    />
                    딜버
                  </label>
                  <label htmlFor='conditionBrand_3'>
                    <input
                      type='checkbox'
                      id='conditionBrand_3'
                      name='conditionBrand'
                      value='MOALINE'
                      defaultChecked={editPostData.postMeta.eventTargetCompany.includes('MOALINE')}
                      onChange={(e) => CheckChange(e)}
                    />
                    모아라인
                  </label>
                </div>
              </div>
              <div className={styles.line}>
                <h3>댓글 활성화 여부</h3>
                <ToggleBtn name="enabledComment" defaultChecked={editPostData.commentEnabled} />
              </div>
            </>
          )}

          <div className={styles.buttonWrap}>
            <Button
              variantStyle="color"
              sizeStyle="sm"
              onClick={() => BoardEdit("edit", voteTitle, voteItemContent, uploadImgUrl, { editVoteData, delVoteData, boardName, postId, startDate, endDate })}
            >
              수정하기
            </Button>
            <Button
              variantStyle="darkgray"
              sizeStyle="sm"
              onClick={() => DeleteSubmit()}
            >
              삭제하기
            </Button>
          </div>
        </div>
      </div>
    );
}

BoardEditDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps = async (context) => {
  const { boardName, detailId: postId } = context.query;
  const { accessToken, refreshToken } = getToken(context);

  const editDataRes = await serverSideGetApi(`/api/boards/${boardName}/posts/${postId}`, accessToken, refreshToken, context);
  const editPostData = (await editDataRes.data) || null;

  const editVoteDataRes = await serverSideGetApi(`/api/boards/${boardName}/posts/${postId}/votes`, accessToken, refreshToken, context);
  const editVoteData = (await editVoteDataRes.data) || null;

  const editTagDataRes = await serverSideGetApi(`/api/boards/${boardName}/posts/${postId}/hashtags`, accessToken, refreshToken, context);
  const editTagData = (await editTagDataRes.data) || null;

  return {
    props: {
      editPostData,
      editVoteData,
      editTagData,
      boardName,
      postId,
    },
  };
};
