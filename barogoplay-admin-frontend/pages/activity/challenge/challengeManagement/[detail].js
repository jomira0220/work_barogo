import { useRouter } from 'next/router';
import {
  FormWarp, SentContent, SentDate,
  SentInput, StyleBox, EditDataCheckBox
} from '@/components/FormSet/FormSet';
import SelectBox from '@/components/SelectBox/SelectBox';
import Button from '@/components/Button/Button';
import styles from './../challenge.module.scss';
import ToggleBtn from '@/components/ToggleBtn/ToggleBtn';
import { useState } from 'react';
import {
  setCondition,
  addConditionValue,
  checkNumber,
  removeValue,
  submitComplete
} from '@/components/utils/activitySet';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi';
import { stringKrChange } from '@/components/utils/stringKrChange';
import Layout from '@/components/Layout/Layout';

export default function ChallengeManagementDetail(props) {

  const router = useRouter();
  let {
    id: challengeId,
    name: challengeName,
    enabled: challengeStatus,
    description: challengeDescription,
    // challengePeriod,
    challengeType, // 챌린지 유형 - WEEKLY
    conditionType: challengeConditionType,
    conditionValue: challengeConditionValue,
    point: challengePoint,
    targetCompany: challengeBrand,
    targetArea: challengeArea,
    details: challengeDetail
  } = props.challengeDetailData;



  const DetailValueData = (type) => {
    const arr = challengeDetail.filter((item) => item.type === type).map((item) => {
      const addArrSet = item.type === "TIME" ? { start: item.value1, end: item.value2 } : { above: item.value1, below: item.value2 }
      return addArrSet
    });
    return arr
  }

  // 이미지 업로드시 
  const [UploadImgUrl, setUploadImgUrl] = useState("");

  // 원본 데이터 확인용
  const originalData = {}
  Object.keys(props.challengeDetailData).filter((item) => item !== "id" && item !== "targetArea").map((item) => originalData[item] = props.challengeDetailData[item])
  console.log(originalData)

  // 수정 데이터 확인용
  const [submitData, setSubmitData] = useState(null)

  // console.log("원본", originalData)
  // console.log("수정", submitData)

  // const [startDate, setStartDate] = useState(new Date(challengePeriod.start));
  // const [endDate, setEndDate] = useState(new Date(challengePeriod.end));

  const [SelectTime, setSelectTime] = useState(DetailValueData("TIME").length > 0 ? true : false);
  const [SelectDistance, setSelectDistance] = useState(DetailValueData("DISTANCE").length > 0 ? true : false);

  const [timeValue, setTimeValue] = useState({ start: 0, end: 0 });
  const [timeValueArr, setTimeValueArr] = useState(DetailValueData("TIME")) // 시간대 조건 배열

  const [distanceValue, setDistanceValue] = useState({ above: 0, below: 0 });
  const [distanceValueArr, setDistanceValueArr] = useState(DetailValueData("DISTANCE")) // 거리 조건 배열

  const [detailCondition, setDetailCondition] = useState(challengeConditionType === "DELIVERY_TOTAL_COUNT" ? true : false);

  // 수정 항목 확인용
  const [changeValue, setChangeValue] = useState()

  const itemTitle = {
    challengeName: "챌린지 명",
    challengeStatus: "활성 상태",
    challengeDescription: "챌린지 설명",
    challengePeriod: "챌린지 기간",
    challengeConditionType: "카운팅 조건",
    challengeConditionValue: "카운팅 상세조건",
    challengePoint: "포인트",
    challengeBrand: "적용 브랜드"
  }


  return (
    <div className='basicBox'>
      <h2>챌린지 상세</h2>
      <FormWarp>
        <StyleBox styletype="line">
          <h3>활성상태</h3>
          <ToggleBtn name="challengeStatus" defaultChecked={challengeStatus} />
        </StyleBox>

        <SentInput
          title="챌린지명"
          type="text"
          name="challengeName"
          defaultValue={challengeName}
        />
        <SentContent
          title="챌린지 설명"
          inputInfo={
            <div className={styles.detailEx}>
              <p>{["{{키워드 : 키워드에 대한 설명}} 으로 입력시"]}</p>
              <p>키워드를 클릭 할 경우 키워드에 대한 설명이 팝업 형태로 노출됩니다.</p>
              <p>{["ex) {{심야배달 : 00시부터 00시까지}}"]}</p>
              <br />
              <p>{["{{키워드}} 으로 입력시 해당 글자만 볼드형태로 노출됩니다."]}</p>
              <p>{["ex) {{50건}} → "]} 심야대발건수가 <b>50건</b> 이상</p>
              <p>* 공백 포함 최대 44자 내로 작성 권장 *</p>
            </div>
          }
          limitCount={130}
          name="challengeContent"
          defaultValue={challengeDescription}
        />




        {/* <div>
          <h3>챌린지 카운팅 기간</h3>
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
        </div> */}

        <div>
          <h3>챌린지 카운팅 조건</h3>
          <StyleBox styletype="line">
            조건
            <SelectBox
              options={[
                { value: "DELIVERY_TOTAL_COUNT", label: "수행건수" },
                { value: "WORKDAY", label: "근무일" },
                { value: "CONSECUTIVE_WORKDAY", label: "연속 근무일" },
              ]}
              onChange={(e) => setCondition(e, setDetailCondition)}
              name="conditionType"
              defaultValue={{ value: challengeConditionType, label: stringKrChange[challengeConditionType] }}
            />
            수치
            <SentInput
              className="numberSet"
              minLength={1}
              placeholder='숫자 입력'
              name="conditionCount"
              defaultValue={challengeConditionValue}
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
                      onChange={(e) => setSelectDistance(e.target.checked)}
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
                              {item.above}km 이상 ~ {item.below}km 이하
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



        <SentInput
          title="경험치"
          className="numberSet"
          placeholder='지급할 경험치 입력'
          name='challengePoint'
          defaultValue={challengePoint}
        />


        <div>
          <h3>적용 브랜드</h3>
          <StyleBox styletype="checkBoxWarp">
            <label htmlFor='conditionBrand_1'>
              <SentInput
                type='checkbox'
                id='conditionBrand_1'
                name='conditionBrand'
                defaultValue='BAROGO'
                defaultChecked={challengeBrand.includes("BAROGO") ? true : false}
              />
              바로고
            </label>
            <label htmlFor='conditionBrand_2'>
              <SentInput
                type='checkbox'
                id='conditionBrand_2'
                name='conditionBrand'
                defaultValue='DEALVER'
                defaultChecked={challengeBrand.includes("DEALVER") ? true : false}
              />
              딜버
            </label>
            <label htmlFor='conditionBrand_3'>
              <SentInput
                type='checkbox'
                id='conditionBrand_3'
                name='conditionBrand'
                defaultValue='MOALINE'
                defaultChecked={challengeBrand.includes("MOALINE") ? true : false}
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
                type="challenge"
                id={challengeId}
              />
            </>
          )
        }

        <div style={{ "display": "flex", "gap": "var(--space-3)" }}>
          <Button
            variantStyle="color"
            sizeStyle="sm"
            onClick={() => {
              submitComplete(
                "challenge", "", setSubmitData, "", "", timeValueArr,
                distanceValueArr, originalData, setChangeValue
              );
            }
            }
          >
            수정 내용 확인
          </Button>
          <Button
            variantStyle="darkgray"
            sizeStyle="sm"
            onClick={() => router.back()}>
            닫기
          </Button>
        </div>
      </FormWarp>
    </div>
  )
}

ChallengeManagementDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps = async (context) => {
  const { refreshToken, accessToken } = getToken(context);
  const { detailId: DataTargetId, detail: DetailType } = context.query;

  const challengeDetailRes = await serverSideGetApi(`/api/challenges/${DataTargetId}`, accessToken, refreshToken, context);
  let challengeDetailData = await challengeDetailRes.data || null;

  return {
    props: {
      challengeDetailData
    }
  }
}