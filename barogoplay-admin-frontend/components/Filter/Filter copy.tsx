import styles from "./Filter.module.scss";
import { ReactEventHandler, useState } from "react";
import { useRouter } from "next/router";
import DatePickerBox from "@/components/DatePickerBox/DatePickerBox";
import { SentInput } from "@/components/FormSet/FormSet";
import { FilterSet } from "./FilterSet";
import { monthSet, daySet } from "@/components/utils/daySet";
import { FilterProps } from "@/interfaces";

export function Filter({
  filterCategory,
  filterTitleSet,
  filterTotalData,
  setFilterTotalData,
  setFilterChangeCheck,
}: FilterProps) {
  let { filterTitle, filterTitleEn, filterType, filterSetItem } =
    FilterSet(filterTitleSet)[0];
  const router = useRouter();
  const query = router.query;

  // ! 페이지가 커뮤니티인 경우와 관리자 게시판인 경우에 따라서 노출되는 게시판 종류 필터값을 다르게 설정
  if (filterTitleEn === "boardCode") {
    if (filterCategory === "eventComment") {
      // 댓글이 없는 faq, 시스템 공지는 제외
      filterSetItem = filterSetItem.slice(3, 6);
    } else if (filterCategory === "eventPost") {
      // 관리자 게시판이 아닌 경우와 system(시스템공지) 제외
      filterSetItem = filterSetItem.slice(3, 7);
    } else if (filterCategory === "hidingPost") {
      // 숨김처리 게시글
      filterSetItem;
    } else if (filterCategory === "hidingComment") {
      // 숨김처리 댓글 - 시스템 공지, faq는 제외
      filterSetItem = filterSetItem.slice(0, 6);
    } else {
      // 커뮤니티용 게시판들
      filterSetItem = filterSetItem.slice(0, 3);
    }
  }

  // ! filterTotalData에서 설정된 기본 값으로 기본 날짜 셋팅
  const filterDataName = Object.keys(filterSetItem);
  const basicDate = (type: string) => {
    const startDate = query[filterDataName[0]]
      ? query[filterDataName[0]]
      : filterTotalData[filterDataName[0]];
    const endDate = query[filterDataName[1]]
      ? query[filterDataName[1]]
      : filterTotalData[filterDataName[1]];
    if (type === "start") {
      return new Date(startDate);
    } else {
      return new Date(endDate);
    }
  };

  const [startDate, setStartDate] = useState(basicDate("start"));
  const [endDate, setEndDate] = useState(basicDate("end"));

  const [radioStartDate, setRadioStartDate] = useState<Date>(
    query["radioStartDate"]
      ? new Date(String(query["radioStartDate"]))
      : new Date()
  );
  const [radioEndDate, setRadioEndDate] = useState(
    query["radioEndDate"] ? new Date(String(query["radioEndDate"])) : new Date()
  );
  const radioDateChange = (date: Date, type: string) => {
    type === "start" ? setRadioStartDate(date) : setRadioEndDate(date);
  };

  //! 기간별 회원 조건 항목 기간 선택 클릭시에만 날짜선택창 노출 처리용
  const [MemberPeriod, setMemberPeriod] = useState(
    query["radioStartDate"] ? true : false
  );

  // 상단 필터 라디오 버튼 선택 처리용
  const RadioEl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 기간별 회원 조건 항목 테이블에서 필터 조건으로 기간선택을 선택했을 경우 날짜 선택창을 노출
    value === "기간선택" ? setMemberPeriod(true) : setMemberPeriod(false);
    filterTotalData[filterTitleEn] = value;
    setFilterTotalData(filterTotalData);
    setFilterChangeCheck && setFilterChangeCheck(true); // 필터값이 변경되었음을 체크
  };

  type ArrayElementType<ArrayType extends Array> = ArrayType[number];

  // 상단 필터 체크 박스 선택 처리용
  const CheckEl = (e: React.ChangeEvent<HTMLInputElement>, title: string) => {
    let checkArr = [];
    const checkbox: ArrayElementType = [
      ...document.querySelectorAll(
        `.${filterCategory} input[name=${filterTitleEn}]`
      ),
    ];

    if (
      !e.currentTarget.parentNode ||
      !e.currentTarget.parentNode.parentNode ||
      !e.currentTarget.parentNode.parentNode.parentNode
    )
      return;
    const allCheck =
      e.currentTarget.parentNode.parentNode.parentNode.querySelector(
        ".allCheck"
      ) as HTMLInputElement;

    if (title !== "전체") {
      if (allCheck) allCheck.checked = false;

      // 전체가 아닌 개별값을 선택하는 경우
      let count = 0; // 체크된 개별값의 갯수를 카운트
      checkbox.map((item) => {
        if (item.checked) {
          // 개별값중에서 체크된 값만 배열로 생성
          checkArr.push(item.value);
          count++;
        } else {
          // 개별값중에서 체크 해제된 값은 배열에서 삭제
          if (checkArr.indexOf(item.value) !== -1) {
            checkArr.splice(checkArr.indexOf(item.value), 1);
          }
        }
      });
      // 개별값이 전부 체크된 경우 전체 선택값을 체크처리하고 개별값들은 전부 체크해제
      if (count === checkbox.length - 1) {
        checkbox.map((item) => {
          item.checked = false;
        });
        if (allCheck) allCheck.checked = true; // 전체 선택값 체크
      }
    } else {
      // 전체 선택값을 선택하는 경우
      checkbox.map((item) => {
        //개별값들은 전부 체크해제
        item.checked = false;
      });
      //전체 선택값은 체크처리
      if (allCheck) allCheck.checked = true;
      checkArr = e.target.value.split(",");
    }

    filterTotalData[filterTitleEn] = checkArr;
    setFilterTotalData(filterTotalData);
    setFilterChangeCheck && setFilterChangeCheck(true); // 필터값이 변경되었음을 체크
  };

  // 날짜 선택 처리용
  const DateEl = (date, type) => {
    const DateArr = { start: startDate, end: endDate };
    if (type === "start") {
      setStartDate(date);
      DateArr.start = date;
      // 시작일이 종료일보다 큰 경우 종료일을 시작일과 동일하게 설정
      if (DateArr.end < date) {
        setEndDate(date);
        DateArr.end = date;
      }
    } else {
      setEndDate(date);
      DateArr.end = date;
    }
    DateArr.start = DateArr.start.toISOString().slice(0, 10);
    DateArr.end = DateArr.end.toISOString().slice(0, 10);

    filterTotalData[filterDataName[0]] = DateArr.start;
    filterTotalData[filterDataName[1]] = DateArr.end;

    setFilterTotalData(filterTotalData);
    setFilterChangeCheck(true); // 필터값이 변경되었음을 체크
  };

  return (
    <>
      <div className={`${styles.filter_col} ${filterCategory}`}>
        <h4 className={styles.filter_title}>{filterTitle}</h4>
        {filterType === "일반" ? (
          <ul className={styles.filter_list}>
            {filterSetItem.map((item, index) => {
              return (
                <li key={index} className={styles.filter_Item}>
                  <input
                    id={`${filterCategory}_${filterTitleEn}_${index}`}
                    className={item.title === "전체" ? "allCheck" : ""}
                    type="checkbox"
                    onChange={(e) => CheckEl(e, item.title)}
                    name={`${filterTitleEn}`}
                    defaultValue={item.value}
                    defaultChecked={
                      query[filterTitleEn]
                        ? query[filterTitleEn].includes(item.value)
                          ? true
                          : false
                        : index === 0
                        ? true
                        : false
                    } // 첫번째 값은 기본 선택값으로 설정
                  />
                  <label
                    htmlFor={`${filterCategory}_${filterTitleEn}_${index}`}
                  >
                    {item.title}
                  </label>
                </li>
              );
            })}
          </ul>
        ) : filterType === "날짜" || filterType === "기준날짜" ? (
          <>
            <div className={styles.filter_datepicker}>
              <DatePickerBox
                dateFormat="yyyy.MM.dd"
                selected={startDate}
                onChange={(date) => DateEl(date, "start")}
              />
              <input
                type="hidden"
                name={`${filterDataName[0]}`}
                value={startDate}
              />
              {filterType === "날짜" && (
                <>
                  <span className={styles.data_icon}>~</span>
                  <DatePickerBox
                    minDate={startDate}
                    dateFormat="yyyy.MM.dd"
                    selected={endDate}
                    onChange={(date) => DateEl(date, "end")}
                  />
                  <input
                    type="hidden"
                    name={`${filterDataName[1]}`}
                    value={endDate}
                  />
                </>
              )}
            </div>
          </>
        ) : filterType === "입력" ? (
          <div className={styles.filter_Number}>
            <SentInput
              className="numberSet"
              name={`${filterTitleEn}`}
              placeholder="0"
              defaultValue={query["likeCountUpper"] ? query.likeCountUpper : 0}
            />
            개 이상만 조회
          </div>
        ) : (
          filterType === "라디오" && (
            <div className={styles.filter_select}>
              <ul className={styles.filter_list}>
                {filterSetItem.map((item, index) => {
                  // 6개월 기간 선택 했는지 여부 확인용 변수 - 7일이거나 6개월인데 6개월이 선택된 경우
                  const monthCheck =
                    query["countBaseDate"] === monthSet(new Date(), 6);
                  const sevenCheck =
                    query["countBaseDate"] === daySet(new Date(), 7);
                  // console.log(query[filterTitleEn], filterTitleEn)
                  const checkedSet =
                    Object.keys(query).length === 0
                      ? index === 0 // 쿼리값이 없는 경우 첫번째 값이 기본값으로 설정
                      : monthCheck && item.title === "6개월" // 6개월이 선택된 경우
                      ? true
                      : !monthCheck && !sevenCheck && item.title === "기간선택" // 기간선택이 선택된 경우
                      ? true
                      : item.title === "전체" && item.value === null // 기본값이 전체인 경우
                      ? true
                      : query[filterTitleEn] !== undefined // 쿼리값이 있는 경우
                      ? String(query[filterTitleEn]) === String(item.value) // 쿼리값이 있고, 쿼리값과 필터값이 같은 경우
                      : index === 0;

                  return (
                    <li
                      key={index}
                      className={
                        styles.filter_Item +
                        " " +
                        (item.title === "기간선택"
                          ? ` ${styles.radioDateSet}`
                          : "")
                      }
                    >
                      <input
                        id={`${filterCategory}_${filterTitleEn}_${index}`}
                        type="radio"
                        name={`${filterTitleEn}`}
                        defaultValue={item.value}
                        defaultChecked={checkedSet} // 첫번째 값은 기본 선택값으로 설정
                        onChange={(e) => RadioEl(e)}
                      />
                      <label
                        htmlFor={`${filterCategory}_${filterTitleEn}_${index}`}
                      >
                        {item.title}
                      </label>
                      {item.title === "기간선택" && MemberPeriod && (
                        // 기간별 회원 조건 항목에서 기간선택을 클릭했을 경우
                        <div className={styles.filter_datepicker}>
                          <DatePickerBox
                            maxDate={new Date()}
                            dateFormat="yyyy.MM.dd"
                            selected={radioStartDate}
                            onChange={(date) => radioDateChange(date, "start")}
                          />
                          <input
                            type="hidden"
                            name={`기준날짜 시작`}
                            value={radioStartDate}
                          />
                          <span className={styles.data_icon}>~</span>
                          <DatePickerBox
                            maxDate={new Date()}
                            minDate={radioStartDate}
                            dateFormat="yyyy.MM.dd"
                            selected={radioEndDate}
                            onChange={(date) => radioDateChange(date, "end")}
                          />
                          <input
                            type="hidden"
                            name={`기준날짜 종료`}
                            value={radioEndDate}
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )
        )}
      </div>
    </>
  );
}
