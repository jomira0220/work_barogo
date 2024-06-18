import Button from "@/components/Button/Button";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import styles from "./badge.module.scss";
import FileInput from "@/components/FileInput/FileInput";
import {
  FormWarp,
  SentContent,
  SentDate,
  SentInput,
  StyleBox,
} from "@/components/FormSet/FormSet";
import SelectBox from "@/components/SelectBox/SelectBox";
import {
  setCondition,
  addConditionValue,
  checkNumber,
  removeValue,
  submitComplete,
} from "@/components/utils/activitySet";
import { useRouter } from "next/router";
import Layout from "@/components/Layout/Layout";
import ToggleBtn from "@/components/ToggleBtn/ToggleBtn";

export default function NewBadge() {

  const router = useRouter();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [SelectTime, setSelectTime] = useState(false);
  const [SelectDistance, setSelectDistance] = useState(false);

  const [timeValue, setTimeValue] = useState({ start: 0, end: 0 });
  const [timeValueArr, setTimeValueArr] = useState([]); // 시간대 조건 배열

  const [distanceValue, setDistanceValue] = useState({ above: 0, below: 0 });
  const [distanceValueArr, setDistanceValueArr] = useState([]); // 거리 조건 배열

  const [detailCondition, setDetailCondition] = useState(true);

  const [submitData, setSubmitData] = useState({});

  const [UploadImgUrl, setUploadImgUrl] = useState("");

  // 시간 선택 범위 배열 생성용 함수
  const timeRange = (start, end) => {
    let array = [];
    for (let i = start; i < end; ++i) {
      array.push({ value: i, label: i });
    }
    return array;
  };

  const startTimeRange = timeRange(1, timeValue.end > 0 ? timeValue.end : 25);
  const endTimeRange = timeRange(timeValue.start + 1, 25);

  return (
    <>
      <div className="basicBox">
        <h2>신규 배지</h2>
        <FormWarp>


          <StyleBox styletype="line">
            <h3>활성상태</h3>
            <ToggleBtn name="badgeStatus" />
          </StyleBox>

          <SentInput
            title="배지명"
            type="text"
            placeholder="배지명을 입력해주세요"
            name="badgeName"
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
            name="badgeContent"
          />

          <SentContent
            title="배지 문구"
            inputInfo="* 공백 포함 최대 47자 내로 작성 권장 *"
            limitCount={50}
            name="badgeContent2"
          />


          <FileInput
            name="badgeImage"
            title="배지 이미지"
            inputInfo="*사용자에게 노출되는 항목입니다."
            accept="image/png, image/jpeg"
            setUploadImgUrl={setUploadImgUrl}
          />

        </FormWarp>
      </div>
      <div className="basicBox">
        <FormWarp>
          <div>
            <h3>배지 기간</h3>
            <StyleBox styletype="line">
              <SentDate
                minDate={new Date()}
                dateFormat="yyyy.MM.dd HH:mm"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                showTimeInput
              />
              ~
              <SentDate
                minDate={startDate}
                dateFormat="yyyy.MM.dd HH:mm"
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
              />
              수치
              <SentInput
                className="numberSet"
                minLength={1}
                placeholder="숫자 입력"
                defaultValue={0}
                name="conditionCount"
              />
            </StyleBox>
          </div>

          {detailCondition && (
            <div className={styles.detailCondition}>
              <h3>상세 조건</h3>

              <div className={styles.conditionInner}>
                <StyleBox styletype="checkBoxWarp">
                  <label htmlFor="conditionTime">
                    <SentInput
                      type="checkbox"
                      id="conditionTime"
                      name="conditionTime"
                      value="conditionTime"
                      onChange={(e) => { setSelectTime(e.target.checked); console.log("fff") }}
                    />
                    시간대
                  </label>
                  {SelectTime && (
                    <>
                      <StyleBox styletype="line">
                        조건
                        <SelectBox
                          options={startTimeRange}
                          defaultValue={{ value: "시간", label: "시간" }}
                          onChange={(e) =>
                            setTimeValue({ ...timeValue, start: e.value })
                          }
                        />
                        시부터
                        <SelectBox
                          options={endTimeRange}
                          defaultValue={{ value: " 시간 ", label: "시간" }}
                          onChange={(e) =>
                            setTimeValue({ ...timeValue, end: e.value })
                          }
                        />
                        시까지
                        <Button
                          variantStyle="color"
                          sizeStyle="sm"
                          onClick={() =>
                            addConditionValue(
                              "time",
                              timeValue,
                              timeValueArr,
                              setTimeValueArr,
                              distanceValue,
                              distanceValueArr,
                              setDistanceValueArr
                            )
                          }
                        >
                          조건 추가
                        </Button>
                      </StyleBox>

                      {timeValueArr.length > 0 && (
                        <div className={styles.timeValue}>
                          시간대 조건
                          <ul className={styles.timeValueItem}>
                            {timeValueArr.map((item, index) => {
                              return (
                                <li key={index}>
                                  {item.start}시 ~ {item.end}시
                                  <button
                                    onClick={() =>
                                      removeValue(
                                        index,
                                        "time",
                                        timeValueArr,
                                        setTimeValueArr,
                                        distanceValueArr,
                                        setDistanceValueArr
                                      )
                                    }
                                  >
                                    ✕
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </StyleBox>

                <StyleBox styletype="checkBoxWarp">
                  <label htmlFor="conditionDistance">
                    <SentInput
                      type="checkbox"
                      id="conditionDistance"
                      name="conditionDistance"
                      value="conditionDistance"
                      onChange={(e) => setSelectDistance(e.target.checked)}
                    />
                    거리
                  </label>
                  {SelectDistance && (
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
                            timeValue,
                            timeValueArr,
                            setTimeValueArr,
                            distanceValue,
                            distanceValueArr,
                            setDistanceValueArr
                          )
                        }
                      >
                        조건 추가
                      </Button>
                    </StyleBox>
                  )}
                </StyleBox>
                {distanceValueArr.length > 0 && (
                  <div className={styles.timeValue}>
                    거리 조건
                    <ul className={styles.timeValueItem}>
                      {distanceValueArr.map((item, index) => {
                        return (
                          <li key={index}>
                            {item.above}km 이상 ~ {item.below}km 이하
                            <button
                              onClick={() =>
                                removeValue(
                                  index,
                                  "distance",
                                  timeValueArr,
                                  setTimeValueArr,
                                  distanceValueArr,
                                  setDistanceValueArr
                                )
                              }
                            >
                              ✕
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h3>경험치</h3>
            <SentInput
              className="numberSet"
              placeholder="지급할 경험치 입력"
              name="badgePoint"
            />
          </div>

        </FormWarp>
      </div>
      <div className='basicBox'>
        <FormWarp>
          <div>
            <h3>적용 브랜드</h3>
            <StyleBox styletype="checkBoxWarp">
              <label htmlFor="conditionBrand_1">
                <SentInput
                  type="checkbox"
                  id="conditionBrand_1"
                  name="conditionBrand"
                  value="BAROGO"
                />
                바로고
              </label>
              <label htmlFor="conditionBrand_2">
                <SentInput
                  type="checkbox"
                  id="conditionBrand_2"
                  name="conditionBrand"
                  value="DEALVER"
                />
                딜버
              </label>
              <label htmlFor="conditionBrand_3">
                <SentInput
                  type="checkbox"
                  id="conditionBrand_3"
                  name="conditionBrand"
                  value="MOALINE"
                />
                모아라인
              </label>
            </StyleBox>
          </div>

          <Button
            variantStyle="color"
            sizeStyle="md"
            onClick={() => {
              submitComplete(
                "badge",
                UploadImgUrl,
                setSubmitData,
                startDate,
                endDate,
                timeValueArr,
                distanceValueArr,
                "",
                "",
                router
              )
            }
            }
          >
            등록하기
          </Button>
        </FormWarp>
      </div>
    </>

  );
}



NewBadge.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};