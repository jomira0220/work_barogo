import { useRouter } from 'next/router';
import FileInput from '@/components/FileInput/FileInput';
import { FormWarp, SentContent, SentDate, SentInput, StyleBox, EditDataCheckBox, SentTarget } from '@/components/FormSet/FormSet';
import SelectBox from '@/components/SelectBox/SelectBox';
import Button from '@/components/Button/Button';
import styles from './../badge.module.scss';
import Image from 'next/image';
import { useState } from 'react';
import {
  setCondition,
  addConditionValue,
  checkNumber,
  removeValue,
  submitComplete,
} from '@/components/utils/activitySet';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi';
import { stringKrChange } from '@/components/utils/stringKrChange';
import Layout from '@/components/Layout/Layout';
import ToggleBtn from '@/components/ToggleBtn/ToggleBtn';
import Apis from '@/components/utils/Apis';



export default function BadgeManagementDetail(props) {
  const router = useRouter();
  let {
    id: badgeId,
    name: badgeName,
    enabled: badgeStatus,
    image: badgeImage,
    point: badgePoint,
    description,
    conditionDescription,
    startDate: badgePeriodStart,
    endDate: badgePeriodEnd,
    conditionType: badgeConditionType,
    conditionValue: badgeConditionValue,
    targetCompany: badgeBrand,
    // targetArea,
    details: badgeDetails,
  } = props.badgeDetailData;

  console.log("원본 배지 데이터", props.badgeDetailData)
  // console.log("badgeDetails", badgeDetails)

  const DetailValueData = (type) => {
    const arr = badgeDetails.filter((item) => item.type === type).map((item) => {
      const addArrSet = item.type === "TIME" ? { start: item.value1, end: item.value2 } : { above: item.value1, below: item.value2 }
      return addArrSet
    });
    return arr
  }

  const [UploadImgUrl, setUploadImgUrl] = useState("");

  // 원본 데이터 확인용
  const originalData = {}
  // 배지코드와 타겟 지역을 제외한 데이터만 원본 데이터로 설정
  Object.keys(props.badgeDetailData).filter((item) => item !== "id" && item !== "targetArea").map((item) => originalData[item] = props.badgeDetailData[item])



  // 수정 데이터 확인용
  const [submitData, setSubmitData] = useState(null)

  const [startDate, setStartDate] = useState(new Date(badgePeriodStart));
  const [endDate, setEndDate] = useState(new Date(badgePeriodEnd));

  const [SelectTime, setSelectTime] = useState(DetailValueData("TIME").length > 0 ? true : false);
  const [SelectDistance, setSelectDistance] = useState(DetailValueData("DISTANCE").length > 0 ? true : false);

  const [timeValue, setTimeValue] = useState({ start: 0, end: 0 });
  const [timeValueArr, setTimeValueArr] = useState(DetailValueData("TIME")) // 시간대 조건 배열

  const [distanceValue, setDistanceValue] = useState({ above: 0, below: 0 });
  const [distanceValueArr, setDistanceValueArr] = useState(DetailValueData("DISTANCE")) // 거리 조건 배열

  const [detailCondition, setDetailCondition] = useState(badgeConditionType === "DELIVERY_TOTAL_COUNT" ? true : false);

  // 수정된 항목 확인용
  const [changeValue, setChangeValue] = useState()


  const [BadgeGrantPop, setBadgeGrantPop] = useState(false);


  //! 페이지 모드 변경 - 상세페이지 수정 모드 혹은 배지 부여 모드
  const TypeChange = (e) => {
    const type = e.target.id.split("_")[1];
    if (type === "edit") {
      setBadgeGrantPop(false)
    } else {
      setBadgeGrantPop(true)
    }
  }

  const [FileView, setFileView] = useState(null);
  const badgeGrantHandler = async () => {
    const userIds = await FileView.data.processedUserList.map((item) => item.id)
    console.log("발송대상리스트", userIds, "배지아이디", badgeId)

    const badgePost = await Apis.post("/api/badges/users", { userIds: userIds, badgeId: badgeId })
    console.log("배지부여", badgePost)

    if (badgePost.status === 200 && badgePost.data.status === "success") {
      alert("배지가 부여되었습니다.")
      location.href = "/activity/badge/badgeManagement"
    } else {
      alert(badgePost.data.message)
    }
  }


  return (
    <>
      <div className='basicBox'>
        <div className={styles.badgeDetailType}>
          <h2>배지 상세</h2>
          <div className={styles.typeControlBox}>
            <h4>페이지 모드 선택</h4>
            <ul>
              <li>
                <label htmlFor='badgeDetailType_edit'>
                  <input id='badgeDetailType_edit' type='radio' name='badgeDetailType' defaultChecked onChange={(e) => TypeChange(e)} />상세 페이지 수정
                </label>
              </li>
              <li>
                <label htmlFor='badgeDetailType_grant'>
                  <input id='badgeDetailType_grant' type='radio' name='badgeDetailType' onChange={(e) => TypeChange(e)} /> 배지 부여
                </label>
              </li>
            </ul>
          </div>
        </div>
        {
          BadgeGrantPop && (
            <FormWarp>
              <div className={styles.badgeGrantInto}>
                <Image src={badgeImage || "/images/logo.png"} width={80} height={80} alt={badgeName + "이미지"} priority />
                <h3>{badgeName}</h3>
                <p>{description}</p>
              </div>
              <SentTarget FileView={FileView} setFileView={setFileView} name="badgeGrantTarget" />
              <div className={styles.buttonWarp}>
                <Button variantStyle="color" sizeStyle="sm" onClick={() => badgeGrantHandler()}>배지 부여</Button>
                <Button variantStyle="darkgray" sizeStyle="sm" onClick={() => location.href = "/activity/badge/badgeManagement"}>배지 목록 보기</Button>
              </div>
            </FormWarp>
          )
        }


        {!BadgeGrantPop && (
          <FormWarp>
            <StyleBox styletype="line">
              <h3>배지 활성 상태</h3>
              <ToggleBtn name="badgeStatus" defaultChecked={badgeStatus} />
            </StyleBox>

            <SentInput
              title="배지명"
              type="text"
              name="badgeName"
              defaultValue={badgeName}
            />

            <SentContent
              title="조건 설명"
              inputInfo={
                <div className={styles.detailEx}>
                  <p>{["{{키워드 : 키워드에 대한 설명}} 으로 입력시"]}</p>
                  <p>키워드를 클릭 할 경우 키워드에 대한 설명이 팝업 형태로 노출됩니다.</p>
                  <p>{["ex) {{심야배달 : 00시부터 00시까지}}"]}</p>
                  <br />
                  <p>{["{{키워드}} 으로 입력시 해당 글자만 볼드형태로 노출됩니다."]}</p>
                  <p>{["ex) {{50건}} → "]} 심야대발건수가 <b>50건</b> 이상</p>
                  <p>* 공백 포함 최대 52자 내로 작성 권장 *</p>
                </div>
              }
              limitCount={130}
              name="badgeContent2"
              defaultValue={conditionDescription}
            />

            <SentContent
              title="배지 문구"
              inputInfo="* 공백 포함 최대 47자 내로 작성 권장 *"
              limitCount={100}
              name="badgeContent"
              defaultValue={description}
            />

            <StyleBox>
              <FileInput
                title="배지 이미지"
                name="badgeImage"
                accept="image/png, image/jpeg"
                setUploadImgUrl={setUploadImgUrl}
              />
              <Image src={badgeImage || "/images/logo.png"} width={80} height={80} alt={badgeName + "이미지"} priority />
            </StyleBox>

          </FormWarp>
        )}

      </div>
      {!BadgeGrantPop && (
        <>
          <div className='basicBox'>
            <FormWarp>
              <div>
                <h3>배지 기간</h3>
                <StyleBox styletype="line">
                  <SentDate
                    minDate={new Date()}
                    dateFormat='yyyy.MM.dd HH:mm'
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showTimeInput
                  />
                  ~
                  <SentDate
                    minDate={startDate}
                    dateFormat='yyyy.MM.dd HH:mm'
                    selected={startDate >= endDate ? startDate : endDate}
                    onChange={(date) => setEndDate(date)}
                    showTimeInput
                  />
                </StyleBox>
              </div>

              <div>
                <h3>배지 조건</h3>
                <StyleBox styletype="line">
                  조건
                  <SelectBox
                    options={[
                      { value: "DELIVERY_TOTAL_COUNT", label: "수행건수" },
                      { value: "WORKDAY", label: "근무일" },
                      { value: "CONSECUTIVE_WORKDAY", label: "연속 근무일" },
                      { value: "DELIVERY_ONEDAY_COUNT", label: "일최대배달건수" },
                    ]}
                    onChange={(e) => setCondition(e, setDetailCondition)}
                    name="conditionType"
                    defaultValue={{ value: badgeConditionType, label: stringKrChange[badgeConditionType] }}
                  />
                  수치
                  <SentInput
                    className="numberSet"
                    minLength={1}
                    placeholder='숫자 입력'
                    name="conditionCount"
                    defaultValue={badgeConditionValue}
                  />
                </StyleBox>
              </div>

              {
                detailCondition && (
                  <div className={styles.detailCondition}>
                    <h3>상세 조건</h3>

                    <div className={styles.conditionInner}>
                      <StyleBox styletype="checkBoxWarp">
                        <label htmlFor='conditionTime'>
                          <SentInput
                            type='checkbox'
                            id='conditionTime'
                            name='conditionTime'
                            onChange={(e) => setSelectTime(e.target.checked)}
                            defaultChecked={SelectTime}
                          />
                          시간대
                        </label>
                        {SelectTime &&
                          <>
                            <StyleBox styletype="line">
                              조건
                              <SelectBox
                                options={[...Array(24)].map((v, i) => ({ value: i + 1, label: i + 1 }))}
                                defaultValue={{ value: "시간", label: "시간" }}
                                onChange={(e) => setTimeValue({ ...timeValue, start: e.value })}
                              />
                              시부터
                              <SelectBox
                                options={[...Array(24)].map((v, i) => ({ value: i + 1, label: i + 1 }))}
                                defaultValue={{ value: " 시간 ", label: "시간" }}
                                onChange={(e) => setTimeValue({ ...timeValue, end: e.value })}
                              />
                              시까지
                              <Button
                                variantStyle="color"
                                sizeStyle="sm"
                                onClick={() =>
                                  addConditionValue(
                                    "time",
                                    timeValue, timeValueArr, setTimeValueArr,
                                    distanceValue, distanceValueArr, setDistanceValueArr
                                  )}>
                                조건 추가
                              </Button>
                            </StyleBox>

                            {
                              timeValueArr.length > 0 && (
                                <div className={styles.timeValue}>
                                  시간대 조건
                                  <ul className={styles.timeValueItem}>
                                    {timeValueArr.map((item, index) => {
                                      return (
                                        <li key={index}>
                                          {item.start}시 ~ {item.end}시
                                          <button onClick={() =>
                                            removeValue(
                                              index,
                                              "time",
                                              timeValueArr,
                                              setTimeValueArr,
                                              distanceValueArr,
                                              setDistanceValueArr
                                            )}>✕</button>
                                        </li>
                                      )
                                    })}
                                  </ul>
                                </div>
                              )
                            }

                          </>
                        }
                      </StyleBox>

                      <StyleBox styletype="checkBoxWarp">
                        <label htmlFor='conditionDistance'>
                          <SentInput
                            type='checkbox'
                            id='conditionDistance'
                            name='conditionDistance'
                            onChange={(e) => { setSelectDistance(e.target.checked), console.log(e.target.checked) }}
                            defaultChecked={SelectDistance}
                          />
                          거리
                        </label>
                        {SelectDistance &&
                          <StyleBox styletype="line">
                            조건
                            <SentInput
                              type="number"
                              step="0.001"
                              name="above"
                              min="0"
                              defaultValue={0}
                              onChange={(e) => {
                                checkNumber(e, distanceValue, setDistanceValue);
                              }}
                            />
                            km 이상
                            <SentInput
                              type="number"
                              step="0.001"
                              name="below"
                              min="0"
                              defaultValue={0}
                              onChange={(e) => {
                                checkNumber(e, distanceValue, setDistanceValue);
                              }}
                            />
                            km 이하
                            <Button
                              variantStyle="color"
                              sizeStyle="sm"
                              onClick={() =>
                                addConditionValue(
                                  "distance",
                                  timeValue, timeValueArr, setTimeValueArr,
                                  distanceValue, distanceValueArr, setDistanceValueArr
                                )}>조건 추가</Button>
                          </StyleBox>
                        }
                      </StyleBox>
                      {
                        SelectDistance && distanceValueArr.length > 0 && (
                          <div className={styles.timeValue}>
                            거리 조건
                            <ul className={styles.timeValueItem}>
                              {distanceValueArr.map((item, index) => {
                                return (
                                  <li key={index}>
                                    {item.above + "km 이상"}
                                    {item.below > item.above && " ~ " + item.below + "km 이하"}
                                    <button onClick={() =>
                                      removeValue(
                                        index,
                                        "distance",
                                        timeValueArr,
                                        setTimeValueArr,
                                        distanceValueArr,
                                        setDistanceValueArr
                                      )}>✕</button>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        )
                      }

                    </div>
                  </div>
                )
              }


              <div>
                <h3>경험치</h3>
                <SentInput
                  className="numberSet"
                  placeholder='지급할 경험치 입력'
                  name='badgePoint'
                  defaultValue={badgePoint}
                />
              </div>

            </FormWarp>
          </div>
          <div className='basicBox'>
            <FormWarp>
              <div>
                <h3>적용 브랜드</h3>
                <StyleBox styletype="checkBoxWarp">
                  <label htmlFor='conditionBrand_1'>
                    <SentInput
                      type='checkbox'
                      id='conditionBrand_1'
                      name='conditionBrand'
                      defaultValue='BAROGO'
                      defaultChecked={badgeBrand.includes("BAROGO") ? true : false}
                    />
                    바로고
                  </label>
                  <label htmlFor='conditionBrand_2'>
                    <SentInput
                      type='checkbox'
                      id='conditionBrand_2'
                      name='conditionBrand'
                      defaultValue='DEALVER'
                      defaultChecked={badgeBrand.includes("DEALVER") ? true : false}
                    />
                    딜버
                  </label>
                  <label htmlFor='conditionBrand_3'>
                    <SentInput
                      type='checkbox'
                      id='conditionBrand_3'
                      name='conditionBrand'
                      defaultValue='MOALINE'
                      defaultChecked={badgeBrand.includes("MOALINE") ? true : false}
                    />
                    모아라인
                  </label>
                </StyleBox>
              </div>


              {/* 수정한 내용 확인하는 컴포넌트 */}
              {
                submitData && (
                  <>
                    <EditDataCheckBox
                      originalData={originalData}
                      submitData={submitData}
                      changeValue={changeValue}
                      type="badge"
                      id={badgeId}
                    />
                  </>
                )
              }


              <div style={{ display: "flex", gap: "var(--space-3)" }}>
                <Button
                  variantStyle="color"
                  sizeStyle="sm"
                  onClick={() => {
                    submitComplete(
                      "badge", UploadImgUrl, setSubmitData, startDate, endDate, timeValueArr,
                      distanceValueArr, originalData, setChangeValue, router
                    );
                  }}
                >
                  수정 내용 확인
                </Button>
                <Button
                  variantStyle="darkgray"
                  sizeStyle="sm"
                  onClick={() => router.back()}>
                  배지 목록 보기
                </Button>
              </div>
            </FormWarp>

          </div>
        </>
      )}


    </>
  )
}

BadgeManagementDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps = async (context) => {
  const { refreshToken, accessToken } = getToken(context);
  const { detailId: DataTargetId, detail: DetailType } = context.query

  const badgeDetailRes = await serverSideGetApi(
    `/api/badges/${DataTargetId}`,
    accessToken,
    refreshToken,
    context
  );
  const badgeDetailData = await badgeDetailRes.data || []

  return {
    props: {
      badgeDetailData
    }
  }
}