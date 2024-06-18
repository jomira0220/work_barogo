
import Button from '@/components/Button/Button';
import ReactQuillContainer from "@/components/ReactQuill/ReactQuillContainer";
import styles from './write.module.scss';
import TagInputBox from '@/components/TagInputBox/TagInputBox';
import { useState } from 'react';
import SelectBox from '@/components/SelectBox/SelectBox';
import DatePickerBox from '@/components/DatePickerBox/DatePickerBox';
import ToggleBtn from '@/components/ToggleBtn/ToggleBtn';
import FileInput from '@/components/FileInput/FileInput';
import Apis from '@/components/utils/Apis';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout/Layout';
import { TimeKoChange } from '@/components/utils/TimeKoChange';



export default function AdminBoardWrite(props) {

  const router = useRouter();

  const [writePage, setWritePage] = useState(null);
  const [reservationDate, setReservationDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)));

  const [uploadImgUrl, setUploadImgUrl] = useState(null); // 썸네일 이미지 URL
  const [voteInputItem, SetVoteItem] = useState(["", ""]); // 투표 항목 추가 및 삭제
  const [voteBoxOnoff, setVoteBoxOnoff] = useState(false); // 투표 박스 on/off

  const [ShowLineBanner, setShowLineBanner] = useState(false); //  시스템 공지 띠배너 노출 여부
  const [Content, setContent] = useState(true); //  시스템 공지 내용 작성창 노출 여부

  // !모든 사용자에게 게시글 보이기 체크박스 체크시 다른 체크박스 해제 또는 브랜드 선택시 전체 체크박스 해제
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


  // !투표 박스 클릭시 투표 박스 on/off
  const voteBoxClick = () => {
    const voteBox = document.querySelector(`.${styles.voteBox}`);
    const voteTitle = document.querySelector(`.${styles.voteTitle}`);
    if (voteBoxOnoff) {
      setVoteBoxOnoff(false);
      voteBox.classList.remove(styles.on);
    } else {
      setVoteBoxOnoff(true);
      voteBox.classList.add(styles.on);
      voteTitle.focus();
    }
  };


  // !투표 항목 추가 및 삭제
  const VoteAction = (type) => {
    if (type === "add") {
      voteInputItem.length < 10
        ? SetVoteItem([...voteInputItem, ""])
        : alert("투표항목은 최대 10개까지만 추가할 수 있습니다.");
    } else if (type === "remove") {
      const dummy = [...voteInputItem];
      dummy.pop();
      SetVoteItem(dummy);
    }
  };

  // !게시글 등록하기 버튼 클릭
  const writeSubmit = async () => {
    let voteData
    let voteDetailListArr = [];
    if (document.getElementById(styles.vote)) {
      // ~투표 항목 데이터
      document
        .querySelectorAll(`.${styles.voteItem} input`)
        .forEach((item, index) => {
          voteDetailListArr.push({
            content: item.value,
            viewOrder: Number(index) + 1,
          });
        });
      // console.log("투표항목데이터", voteDetailListArr);

      // ~투표 데이터
      voteData = {
        voteName: document.querySelector(`.${styles.voteTitle}`).value
          ? document.querySelector(`.${styles.voteTitle}`).value
          : "",
        endDate: document.querySelector('[name="voteEndDate"]').value,
        duplicatable: document.getElementById(styles.voteDuplicate).checked
          ? true
          : false,
        voteDetailList: voteDetailListArr,
      };
      // console.log("투표데이터", voteData);

    }

    let tags
    if (document.getElementById("tags")) {
      // !태그 데이터
      tags = document.getElementById("tags").value !== ""
        ? document
          .getElementById("tags")
          .value.split(",")
          .map((item) => item.trim())
        : [];
    }

    // ~게시글 전체 데이터
    const writeData = {
      postType: writePage.includes("NOTICE") ? "NOTICE" : "GENERAL", // GENERAL, NOTICE  게시판 공지글인지 아닌지
      title: document.getElementById("title").value,
      content: document.querySelector(".ql-editor").innerHTML,
      hashtags: { tagNameList: tags ? tags : [] }, // ["태그1" , "태그2"]
      thumbnailImageUrl: uploadImgUrl, // 썸네일 이미지 URL
      // reservedDate: reservationDate.toISOString(), // 예약노출일자
      commentEnabled: document.querySelector(`[name="enabledComment"]`) ? document.querySelector(`[name="enabledComment"]`).checked ? true : false : false,
      //vote: document.getElementById(styles.vote) ? document.getElementById(styles.vote).checked ? voteData : {} : {},
    };


    // ~예약노출 데이터가 있을 경우에만 예약노출 데이터 추가
    if (document.querySelector("[name='reservationDate']")) {
      writeData.reservedDate = reservationDate.toISOString();
    }

    // ~투표 데이터가 있을 경우에만 투표 데이터 추가
    if (document.getElementById(styles.vote)) {
      if (document.getElementById(styles.vote).checked) {
        writeData.vote = voteData;
      }
    }


    if (writePage === "event" || writePage === "benefit") { //|| writePage === "news"
      const eventBrand = [];
      document.querySelectorAll(`input[name="conditionBrand"]:checked`).forEach((item) => {
        eventBrand.push(item.value)
      })

      writeData.postMeta = {
        eventStartDate: TimeKoChange(startDate),
        eventEndDate: TimeKoChange(endDate),
        eventTargetCompany: eventBrand,
      };
    }

    if (writePage === "faq") {
      writeData.postMeta = {
        faqCategory: document.querySelector(`[name="faqCategory"]`).value
      }
    }

    if (writePage === "news") {
      const eventBrand = [];
      document.querySelectorAll(`input[name="conditionBrand"]:checked`).forEach((item) => {
        eventBrand.push(item.value)
      })
      writeData.postMeta = {
        eventTargetCompany: eventBrand,
      };
    }


    if (document.getElementById(styles.vote)) {
      // ~투표 항목 입력 확인용 변수
      const checkVoteItem = voteDetailListArr
        .map((item) => (item.content === "" ? false : true))
        .filter((item) => item === false).length > 0
        ? false
        : true;

      if (writeData.title !== "" && writeData.content !== "") {
        if (writeData.containVote && voteData.voteName === "") {
          return alert("투표 질문을 입력해주세요.");
        }
        if (writeData.containVote && checkVoteItem === false) {
          return alert("투표 항목을 입력해주세요.");
        }
      } else {
        if (writeData.title === "") {
          return alert("제목을 입력해주세요.");
        }
        if (writeData.content === "") {
          return alert("내용을 입력해주세요.");
        }
        if (writeData.postMeta) {
          if (writeData.postMeta.startDate === "") {
            return alert("이벤트 시작일을 선택해주세요.");
          } else if (writeData.postMeta.endDate === "") {
            return alert("이벤트 종료일을 선택해주세요.");
          } else if (writeData.postMeta.targetCompany === "") {
            return alert("적용 브랜드를 선택해주세요.");
          }
        }
      }
    }

    console.log("게시글 쓰기 api 상태", writeData, writePage);

    const writePageSet = writePage.includes("NOTICE") ? writePage.split("_")[0] : writePage;
    const writeRes = await Apis.post(`/api/boards/${writePageSet}/posts`, writeData);
    console.log("게시글 쓰기 api 상태", writeRes);
    if (writeRes.status === 200 && writeRes.data.status !== "error") {
      alert("게시글이 등록되었습니다.");
      const type = writePage.includes("NOTICE") ? "community" : "event"
      writePageSet === "system" ? router.push(`/systemNotice`) : router.push(`/board/${type}/post?boardCode=${writePageSet}`)
    } else {
      alert("게시글 등록에 실패했습니다. 사유: " + writeRes.data.message);
    }
  };

  // 투표 시작일, 종료일
  const voteStartDate = new Date().toISOString().slice(0, 10);
  const voteEndDate = new Date(new Date().setDate(new Date().getDate() + 30))
    .toISOString()
    .slice(0, 10);

  const [faqCategory, setFaqCategory] = useState(false);
  const [eventTemplate, setEventTemplate] = useState(false);
  const writeTemplateChange = (value) => {
    if (value === "faq") {
      setFaqCategory(true);
    }
    if (value === "event" || value === "benefit") { // || value === "news"
      setEventTemplate(true);
    } else {
      setEventTemplate(false);
    }
    setWritePage(value);
  }



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


  return (
    <div className='basicBox'>
      {/* <h2>관리자 게시글 작성</h2> */}
      <div className={styles.boardWriteWrap}>

        <div className={styles.line}>
          <h5>게시판 선택</h5>
          <SelectBox
            className={styles.selectBox}
            options={[
              { label: '이벤트', value: 'event' },
              { label: '제휴혜택', value: 'benefit' },
              { label: '뉴스/공지', value: 'news' },
              { label: '플레이 운영 공지', value: 'system' },
              { label: 'FAQ', value: 'faq' },
              { label: '자유게시판 공지글', value: 'free_NOTICE' },
              { label: '활동인증 공지글', value: 'activity_NOTICE' },
              { label: '중고거래 공지글', value: 'junggo_NOTICE' },
            ]}
            defaultValue={{ value: '게시판 선택', label: '게시판 선택' }}
            onChange={(e) => writeTemplateChange(e.value, e.label)}
          />
        </div>

        {writePage === "faq" && faqCategory &&
          <div className={styles.line}>
            <h5>카테고리</h5>
            <SelectBox
              className={styles.selectBox}
              name="faqCategory"
              options={[
                { label: '커뮤니티', value: 'community' },
                { label: '활동기록', value: 'activity' },
                { label: '소셜', value: 'social' },
                { label: '선물', value: 'gift' },
                { label: '계정/연동', value: 'account' },
                { label: '기타', value: 'etc' },
              ]}
              defaultValue={{ label: '커뮤니티', value: 'community' }}
            />
          </div>
        }

        <div className={styles.line}>
          <h5>제목</h5>
          <input id="title" className={styles.writeTitle} type="text" placeholder="제목을 입력하세요." />
        </div>

        {/* {writePage === "system" && (
          <>
            <div div id={styles.bannerExposureTypeBox} className={styles.line}>
              <h5>노출 타입</h5>
              <div className={styles.bannerExposureType}>
                <label><input type='radio' value="notice" name="bannerExposureType" onChange={(e) => ExposureTypeHandler(e)} defaultChecked />공지만 노출</label>
                <label><input type='radio' value="lineBannerNotice" name="bannerExposureType" onChange={(e) => ExposureTypeHandler(e)} />띠배너 + 공지 노출<span>*띠배너 링크 O</span></label>
                <label><input type='radio' value="lineBanner" name="bannerExposureType" onChange={(e) => ExposureTypeHandler(e)} />띠배너만 노출<span>*띠배너 링크 X</span></label>
              </div>
            </div>

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
          </>
        )} */}

        {(eventTemplate || writePage === "news") &&
          <div className={styles.line}>
            <h5>썸네일 이미지</h5>
            <FileInput setUploadImgUrl={setUploadImgUrl} name="EventImage" accept="image/png, image/jpeg" />
          </div>
        }

        {Content && <ReactQuillContainer className={styles.adminBoardContent} />}

        {writePage !== "system" && writePage !== "faq" && (
          <>
            <label htmlFor={styles.vote} className={styles.voteCheckbox}>
              <input id={styles.vote} type="checkbox" onClick={() => voteBoxClick()} />{" "}투표 활성화
            </label>

            <div className={styles.voteBox}>
              <input id="vote" className={styles.voteTitle} type="text" placeholder="질문을 입력해주세요" />
              <div className={styles.voteItem}>
                {voteInputItem.map((item, index) => {
                  return (
                    <label htmlFor={`voteItem_${index}`} key={index}>
                      <input id={`voteItem_${index}`} type="text" placeholder={`투표항목 ${index + 1}`} />
                    </label>
                  );
                })}
              </div>
              <div className={styles.voteDate}>
                <span>투표 마감일</span>
                <div id={styles.voteEndDate}>
                  <DatePickerBox
                    dateFormat="yy년 M월 d일"
                    selected={new Date(voteStartDate)}
                    minDate={new Date(voteStartDate)}
                    maxDate={new Date(voteEndDate)}
                    name="voteEndDate"
                  />
                </div>
                <label htmlFor={styles.voteDuplicate} className={styles.voteDuplicate}>
                  <input id={styles.voteDuplicate} type="checkbox" />중복 투표 가능
                </label>
              </div>
              <div className={styles.voteBtn}>
                {voteInputItem.length > 2 && (
                  <Button className={styles.voteMinusBtn} variantStyle="darkgray" sizeStyle="sm" onClick={() => VoteAction("remove")}>
                    - 항목제거
                  </Button>
                )}
                <Button className={styles.votePlusBtn} variantStyle="darkgray" sizeStyle="sm" onClick={() => VoteAction("add")}>
                  + 항목추가
                </Button>
              </div>
            </div>

            <div className={styles.tagTitle}>해시태그</div>
            <TagInputBox tagData={[]} />
          </>
        )}



        {eventTemplate && (
          <div className={styles.line}>
            <h5>이벤트 기간</h5>
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
        )}

        {(eventTemplate || writePage === "news") &&
          <div className={styles.line}>
            <h5>적용 브랜드</h5>
            <div className={styles.innerBox + " " + styles.brandCheck}>
              <label htmlFor='conditionBrand_0'>
                <input type='checkbox' id='conditionBrand_0' name='conditionBrand' defaultChecked={true} value='ALL' onChange={(e) => CheckChange(e)} />
                전체 <span>*비회원 포함</span>
              </label>
              <label htmlFor='conditionBrand_1'>
                <input type='checkbox' id='conditionBrand_1' name='conditionBrand' defaultChecked={false} value='BAROGO' onChange={(e) => CheckChange(e)} />
                바로고
              </label>
              <label htmlFor='conditionBrand_2'>
                <input type='checkbox' id='conditionBrand_2' name='conditionBrand' defaultChecked={false} value='DEALVER' onChange={(e) => CheckChange(e)} />
                딜버
              </label>
              <label htmlFor='conditionBrand_3'>
                <input type='checkbox' id='conditionBrand_3' name='conditionBrand' defaultChecked={false} value='MOALINE' onChange={(e) => CheckChange(e)} />
                모아라인
              </label>
            </div>
          </div>
        }

        {(writePage === "event" || writePage === "benefit") &&
          <div className={styles.line}>
            <h5>예약 노출</h5>
            <DatePickerBox
              minDate={new Date()}
              dateFormat='yyyy.MM.dd HH:mm'
              name="reservationDate"
              defaultValue={reservationDate}
              onChange={(date) => setReservationDate(date)}
              showTimeInput
            />
          </div>
        }

        {writePage !== "system" && writePage !== "faq" &&
          <div className={styles.line}>
            <h5>댓글 활성화 여부</h5>
            <ToggleBtn name="enabledComment" />
          </div>
        }

        {/* !!! 시스템 공지 띠배너 노출 여부 및 노출 기간 설정 !! */}
        {/* {writePage === "system" && (
          <>
            <div className={styles.line}>
              <h5>띠배너 노출 여부</h5>
              <ToggleBtn name="enabledLineBanner" onClick={() => setShowLineBanner(!ShowLineBanner)} />
            </div>
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
            )}
          </>
        )} */}

        <Button variantStyle="color" sizeStyle="lg" onClick={() => writeSubmit()}>등록하기</Button>
      </div>
    </div >
  )
}

AdminBoardWrite.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}


