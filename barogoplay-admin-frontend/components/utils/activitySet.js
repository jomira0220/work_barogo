import Apis from "./Apis";


// 배지 카운팅 조건 설정에 따라 상세 조건 보이기
export const setCondition = (e, setDetailCondition) => {
  e.label === "수행건수" ? setDetailCondition(true) : setDetailCondition(false)
}

// 조건 추가
export const addConditionValue = (
  type, timeValue, timeValueArr, setTimeValueArr,
  distanceValue, distanceValueArr, setDistanceValueArr
) => {
  let addValue = true;
  let typeBool = type === "time" ? true : false;

  // 기본 조건값은 시간대
  let valueDummyArr = typeBool ? [...timeValueArr] : [...distanceValueArr]
  let valueDummy = typeBool ? { ...timeValue } : { ...distanceValue }
  let firstKey = typeBool ? "start" : "above"
  let secondKey = typeBool ? "end" : "below"

  // 조건값 숫자로 변환
  valueDummy[firstKey] = Number(valueDummy[firstKey])
  valueDummy[secondKey] = Number(valueDummy[secondKey])

  // 첫번째 조건값이 두번째 조건값보다 클 경우 첫번째 조건값과 두번째 조건값을 바꿈
  if (valueDummy[firstKey] > valueDummy[secondKey]) {
    return alert("시작 조건이 종료 조건보다 클 수 없습니다.")
    // valueDummy = { [firstKey]: valueDummy[secondKey], [secondKey]: valueDummy[firstKey] }
  }

  // 조건 선택이 안된 경우
  (valueDummy[firstKey] === 0 && valueDummy[secondKey] === 0)
    ? alert("조건를 선택해주세요")
    // 첫번째 조건값과 두번째 조건값이 같은 경우
    : valueDummy[firstKey] === valueDummy[secondKey]
      ? alert("시작 조건과 종료 조건이 같을 수 없습니다.")
      : valueDummy[firstKey] !== 0 && valueDummy[secondKey] !== 0
        ? (
          // 시간 조건이 설정되었으나 중복인 경우 중복 알림
          valueDummyArr.map((item) => {
            if (
              item[firstKey] === valueDummy[firstKey] && item[secondKey] === valueDummy[secondKey]
              || item[firstKey] === valueDummy[secondKey] && item[secondKey] === valueDummy[firstKey]
            ) {
              alert("이미 추가된 조건입니다.")
              addValue = false
              return false
            }
          }),
          addValue && ( // 중복이 아닌 경우 배열에 추가
            type === "distance"
              ? setDistanceValueArr([...distanceValueArr, valueDummy])
              : setTimeValueArr([...timeValueArr, valueDummy])
          )
        )
        : (valueDummy[firstKey] === 0 && valueDummy[secondKey] !== 0)
          || (valueDummy[firstKey] !== 0 && valueDummy[secondKey] === 0)
          && type === "distance"
          ? setDistanceValueArr([...distanceValueArr, valueDummy])
          : alert("조건를 선택해주세요")
}


// 거리 조건 입력시 소수점 자리 제한
export const checkNumber = (e, distanceValue, setDistanceValue) => {
  const number = e.target.value;
  const regexp = /^\d*.?\d{0,3}$/;
  if (!regexp.test(number)) {
    alert("소수점 셋째자리까지 입력가능합니다.");
    e.target.value = number.substring(0, number.length - 1);
  } else {
    setDistanceValue({ ...distanceValue, [e.target.name]: e.target.value })
  }
}

// 시간 혹은 거리 조건 삭제
export const removeValue = (index, type, timeValueArr, setTimeValueArr, distanceValueArr, setDistanceValueArr) => {
  type === "time"
    ? setTimeValueArr(timeValueArr.filter((item, i) => i !== index))
    : setDistanceValueArr(distanceValueArr.filter((item, i) => i !== index))
}


// !배지, 챌린지 생성 완료 처리용 함수
export const submitComplete = async (
  submitKind, UploadImgUrl, setSubmitData, startDate, endDate, timeValueArr,
  distanceValueArr, originalData, setChangeValue, router
) => {

  // submitKind : "badge" 또는 "challenge"
  // setSubmitData : submitData를 넣는 함수
  // startDate : 시작 날짜
  // endDate : 종료 날짜
  // timeValueArr : 시간 조건 배열
  // distanceValueArr : 거리 조건 배열
  // originalData : 수정인 경우 오리지널 데이터
  // changeValue : 변경된 내용이 있는지 확인하는 객체
  // setChangeValue : 변경된 내용이 있는지 확인하는 객체를 변경하는 함수

  console.log(startDate, endDate)

  // 오리지널 데이터가 없으면 null로 설정
  originalData === undefined && (originalData = null)

  const selectValue = (name) => document.querySelector(`[name="${name}"]`).value;
  const checkValue = (name) => document.querySelector(`[name="${name}"]`).checked;

  let data = submitKind === "badge" ? {
    // 배지 생성인 경우
    name: selectValue("badgeName"),
    image: UploadImgUrl,
    description: selectValue("badgeContent"),
    conditionDescription: selectValue("badgeContent2"),
    targetArea: "ALL",
    targetCompany: "", // BAROGO,DEALVER,MOALINE
    startDate: new Date(startDate).toISOString().slice(0, 10),
    endDate: new Date(endDate).toISOString().slice(0, 10),
    enabled: checkValue("badgeStatus"),
    conditionType: selectValue("conditionType"), //DELIVERY_TOTAL_COUNT, CONSECUTIVE_WORKDAY, WORKDAY
    conditionValue: Number(selectValue("conditionCount")),
    point: selectValue("badgePoint").includes(",") ? Number(selectValue("badgePoint").replace(",", "")) : Number(selectValue("badgePoint")) || 0,
    details: [
      ...timeValueArr.map((item) => {
        return {
          type: "TIME",
          value1: item.start,
          value2: item.end,
          value3: null
        }
      }),
      ...distanceValueArr.map((item) => {
        return {
          type: "DISTANCE",
          value1: item.above,
          value2: item.below,
          value3: null
        }
      })
      // {
      //   "type": "string", // TIME, DISTANCE
      //   "value1": "string", // 시작시간, 시작거리
      //   "value2": "string", // 종료시간, 종료거리
      // }

    ] // 배지 조건 상세
  } : {
    // 챌린지 생성인 경우
    name: selectValue("challengeName"),
    image: UploadImgUrl,
    challengeType: "WEEKLY", //WEEKLY, MONTHLY 
    description: selectValue("challengeContent"),
    targetCompany: "", // BAROGO,DEALVER,MOALINE
    targetArea: "ALL", // 서울, 경기, 인천, 대전, 대구, 부산, 광주, 울산, 세종, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주
    conditionType: selectValue("conditionType"),
    conditionValue: Number(selectValue("conditionCount")),
    point: selectValue("challengePoint").includes(",") ? Number(selectValue("challengePoint").replace(",", "")) : Number(selectValue("challengePoint")) || 0,
    enabled: checkValue("challengeStatus"),

    details: [
      ...timeValueArr.map((item) => {
        return {
          type: "TIME",
          value1: item.start,
          value2: item.end,
          value3: null
        }
      }),
      ...distanceValueArr.map((item) => {
        return {
          type: "DISTANCE",
          value1: item.above,
          value2: item.below,
          value3: null
        }
      })
    ]
  }

  // 체크 선택한 브랜드 data브랜드 배열에 넣기
  const companyArr = [];
  document.querySelectorAll('[name="conditionBrand"]').forEach(
    (item) => item.checked && companyArr.push(item.value)
  )
  data.targetCompany = companyArr.join(",")

  // 오리지널 데이터가 있는 수정인 경우 - 배지 이미지가 없으면 기존 이미지로 그대로 넣음
  // originalData && submitKind === "badge" && data.image === "" && (data.image = originalData.image)
  originalData && data.image === "" && (data.image = originalData.image)

  // 배지, 챌린지 구분
  const dataKindName = submitKind === "badge" ? "배지" : "챌린지"

  // // 상세 조건이 없는 경우
  // if (data.details.length === 0) {
  //   data.details = []
  // }

  // 필수 입력 항목 체크 
  if (data.name === "") {
    alert(`${dataKindName}명을 입력해주세요`)
  } else if (!originalData && submitKind === "badge" && !data.image) {
    // 오리지널 데이터가 없는 배지 신규 생성인 경우 이미지가 없으면 알림
    alert("배지 이미지를 업로드해주세요")
  } else if (data.description === "") {
    alert(`${dataKindName} 설명을 입력해주세요`)
  } else if (
    data.conditionType !== "DELIVERY_TOTAL_COUNT"
    && data.conditionValue === 0
  ) {
    alert("수치 조건을 입력해주세요")
  } else if (
    data.point === 0
  ) {
    alert("지급할 포인트를 입력해주세요")
  } else if (
    data.targetCompany.length === 0
  ) {
    alert("적용 브랜드를 선택해주세요")
  } else {

    // 필수 입력 항목이 모두 입력되었으면 변경된 내용이 있는지 확인
    // console.log("originalData", originalData)
    if (originalData) {  // 오리지널 데이터가 있는 수정인 경우에만 실행

      let changeWhether = false;
      let valueCheck = {};
      Object.keys(originalData).map((item) => valueCheck[item] = false)



      Object.keys(data).forEach((valueTitle) => {
        if (
          (
            typeof originalData[valueTitle] === 'object' &&
            JSON.stringify(originalData[valueTitle]) !== JSON.stringify(data[valueTitle])
          )
          ||
          (
            typeof originalData[valueTitle] !== 'object' &&
            String(originalData[valueTitle]) !== String(data[valueTitle])
          )
        ) {
          changeWhether = true;
          valueCheck[valueTitle] = true
          setChangeValue(valueCheck)
        }
      })
      // console.log("변경된 내용", data, valueCheck)
      if (changeWhether) {
        setSubmitData(data)
        // 수정의 경우 FromSet에서 ModifySave이벤트로 받은 데이터를 넣어서 수정 완료 처리
        console.log("수정전 원본데이터", originalData)
        console.log("수정된데이터", data)
      } else {
        setSubmitData(null)
        alert("변경된 내용이 없습니다.")
      }
    } else {
      // 오리지널 데이터가 없는 형태의 신규 생성인 경우
      setSubmitData(data)
      console.log("신규생성데이터", data)
      const post = await Apis.post(`/api/${submitKind}s`, data)
      console.log("post", post)
      router.push(`/activity/${submitKind}/${submitKind}Management`)
      // return true

    }

  }
}