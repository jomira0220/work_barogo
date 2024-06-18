import Layout from "@/components/Layout/Layout";
import ReactQuillContainer from "@/components/ReactQuill/ReactQuillContainer";
import Button from "@/components/Button/Button";
import styles from "./edit.module.scss";
import { useState } from "react";
import { getToken, serverSideGetApi } from "@/components/utils/serverSideGetApi";
import { useRouter } from "next/router";
import Apis from "@/components/utils/Apis";
// import ToggleBtn from "@/components/ToggleBtn/ToggleBtn";
import DatePickerBox from "@/components/DatePickerBox/DatePickerBox";
import { TimeKoChange } from "@/components/utils/TimeKoChange";

export default function NoticeEdit(props) {
  const router = useRouter();
  const {
    isLogin,
    detailId,
    editPostData, // 원본 게시글 데이터
  } = props;

  console.log("플레이 운영 공지 상세", editPostData, isLogin);

  const [delImgCheck, setDelImgCheck] = useState({ onoff: false, imgList: [] }); // 삭제할 이미지들

  //!! 나중에 띠배너 노출 여부에 따라서 날짜 데이터 확인하여 넣어줘야함
  const [ShowLineBanner, setShowLineBanner] = useState(false); //  시스템 공지 띠배너 노출 여부
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)));


  // !게시글 수정 api 호출
  const EditSubmit = async () => {

    // ~최종으로 올라갈 이미지들
    const imgSrcList = [];
    document.querySelectorAll(".ql-editor img").forEach((item) => {
      imgSrcList.push(item.alt);
    });
    // console.log("최종 게시할 이미지들", imgSrcList)

    //!올라간 이미지 중 삭제할 이미지들 확인 처리용
    setDelImgCheck({ onoff: true, imgList: imgSrcList });

    // // ~게시글 타입 확인 - 공지만 노출, 띠배너 + 공지 노출, 띠배너만 노출
    // const exposureType = document.querySelectorAll('input[name="bannerExposureType"]:checked')[0].value;
    // console.log("게시글 노출 타입", exposureType);

    // let lineBannerStartDate, lineBannerEndDate;
    // if (exposureType !== "notice") {
    //   // ~띠배너 노출 시간
    //   lineBannerStartDate = TimeKoChange(new Date(document.querySelector("input[name='lineBannerStartDate']").value));
    //   lineBannerEndDate = TimeKoChange(new Date(document.querySelector("input[name='lineBannerEndDate']").value));
    //   console.log("띠배너 노출 시간", lineBannerStartDate, lineBannerEndDate);
    // }

    // ~게시글 전체 데이터
    const writeData = {
      // postType: "GENERAL",
      title: document.getElementById("title").value,
      // content: exposureType === "lineBanner" ? "" : document.querySelector(".ql-editor").innerHTML,
      content: document.querySelector(".ql-editor").innerHTML,
      hashtags: { tagNameList: [] }, // ["태그1" , "태그2"]
      thumbnailImageUrl: "",
      reservedDate: "",
      commentEnabled: false, // 댓글 활성화 여부 - 시스템공지는 무조건 false
      vote: {},
      postMeta: {
        startDate: "",
        endDate: "",
        targetCompany: ["BAROGO", "DEALVER", "MOALINE"]
      }
    };

    // ~노출 타입이 공지만 노출이 아닌 경우 띠배너 노출 시간 추가
    // if (exposureType !== "notice") {
    //   writeData.lineBannerStartDate = lineBannerStartDate
    //   writeData.lineBannerEndDate = lineBannerEndDate
    // }

    console.log("게시글 전체 데이터", writeData);

    // ~게시글 내용 수정 api 호출
    const EditRes = await Apis.put(
      `/api/boards/system/posts/${detailId}`,
      writeData
    );
    console.log("게시글 내용 수정 api 상태", EditRes, detailId);
    if (EditRes.status === 200 && EditRes.data.status !== "error") {
      alert("게시글이 수정되었습니다.");
      router.reload()
    } else {
      alert("게시글 수정에 실패했습니다.");
    }
  };


  //! 게시글 삭제 api 호출
  const DeleteSubmit = async () => {
    const DeleteRes = await Apis.delete(`/api/boards/system/posts/${detailId}`);
    console.log("게시글 삭제 api 상태", DeleteRes);
    if (DeleteRes.status === 200 && DeleteRes.data.status !== "error") {
      alert("게시글이 삭제되었습니다.");
      router.back()
    } else {
      alert("게시글 삭제에 실패했습니다.");
    }
  }


  const [Content, setContent] = useState(true);
  //! 공지 노출 방식 선택
  const ExposureTypeHandler = (e) => {
    const type = e.target.value;
    if (type === "lineBanner" || type === "lineBannerNotice") {
      setShowLineBanner(true);
      setContent(true)
      type === "lineBanner" && setContent(false)
    } else {
      setShowLineBanner(false);
      setContent(true)
    }
  }

  if (isLogin === "true")
    return (
      <div className='basicBox'>
        <h2>플레이 운영 공지 상세</h2>
        <div className={styles.boardWriteWrap}>
          <div className={styles.line}>
            <h5>제목</h5>
            <input id="title" className={styles.writeTitle} type="text" placeholder="제목을 입력하세요." defaultValue={editPostData.title} />
          </div>

          {/* 띠배너 노출 여부 설정 박스 
          <div id={styles.bannerExposureTypeBox} className={styles.line}>
            <h5>노출 타입</h5>
            <div className={styles.bannerExposureType}>
              <label><input type='radio' value="notice" name="bannerExposureType" onChange={(e) => ExposureTypeHandler(e)} defaultChecked />공지만 노출</label>
              <label><input type='radio' value="lineBannerNotice" name="bannerExposureType" onChange={(e) => ExposureTypeHandler(e)} />띠배너 + 공지 노출<span>*띠배너 링크 O</span></label>
              <label><input type='radio' value="lineBanner" name="bannerExposureType" onChange={(e) => ExposureTypeHandler(e)} />띠배너만 노출<span>*띠배너 링크 X</span></label>
            </div>
          </div>*/}

          {ShowLineBanner && (
            <div className={styles.line}>
              <h5>띠배너 노출 기간</h5>
              <div className={styles.innerBox}>
                <DatePickerBox
                  minDate={new Date()}
                  dateFormat='yyyy.MM.dd HH:mm'
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeInput
                  name="lineBannerStartDate"
                />
                ~
                <DatePickerBox
                  minDate={startDate}
                  dateFormat='yyyy.MM.dd HH:mm'
                  selected={startDate >= endDate ? startDate : endDate}
                  onChange={(date) => setEndDate(date)}
                  showTimeInput
                  name="lineBannerEndDate"
                />
              </div>
            </div>
          )}

          {
            Content && <ReactQuillContainer className={styles.adminBoardContent} content={editPostData.content} />
          }

          <div className={styles.buttonWrap}>
            <Button className={styles.editBtn} variantStyle="color" sizeStyle="sm" onClick={() => EditSubmit()}>
              수정하기
            </Button>

            <Button className={styles.editBtn} variantStyle="darkgray" sizeStyle="sm" onClick={() => DeleteSubmit()}>
              삭제하기
            </Button>
          </div>
        </div>

      </div>
    );
}

NoticeEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = await getToken(context);
  const { detailId } = context.query;
  const editDataRes = await serverSideGetApi(`/api/boards/system/posts/${detailId}`, accessToken, refreshToken, context);
  const editPostData = (await editDataRes.data) || null;

  return {
    props: {
      editPostData,
      detailId,
    },
  };
};
