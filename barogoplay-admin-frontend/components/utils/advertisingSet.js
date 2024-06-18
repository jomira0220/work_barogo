import Apis from "./Apis";


// export const bannerPosition = [
//   { value: "큰 배너", label: "큰 배너" },
//   { value: "작은 배너", label: "작은 배너" },
// ]

// 초수를 제외한 날짜를 현재 날짜 및 시간과 비교하기 위한 함수
export const dateRemoveSecond = (date) => {
  const yyyy = date.getFullYear();
  const mm = date.getMonth() + 1;
  const dd = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hh = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:59`)
}

// 광고 신규 등록 및 수정 api 호출 및 페이지 이동 함수
export const newAdvertisingHandler = async (
  handlerType, setDateAlert, setStartDate,
  startDate, setEndDate, endDate, originalData,
  changeValue, setChangeValue, setSubmitData, UploadImgUrl
) => {


  // handlerType : new(신규 등록), edit(수정)
  // setDateAlert : 날짜 경고 노출 여부
  // setStartDate : 시작일 설정 함수
  // startDate : 시작일
  // setEndDate : 종료일 설정 함수
  // endDate : 종료일
  // originalData : 수정시 기존 데이터
  // changeValue : 변경된 내용이 있는지 확인하는 객체
  // setChangeValue : 변경된 내용이 있는지 확인하는 객체 변경 함수


  const selectValue = (name) => document.querySelector(`[name="${name}"]`).value;

  const checkUrl = (strUrl) => {
    // let expUrl = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    let expUrl = /^http[s]?:\/\/([\S]{3,})/i
    return expUrl.test(strUrl) ? true : false;
  }

  const eventBrand = [];
  document.querySelectorAll(`input[name="conditionBrand"]:checked`).forEach((item) => {
    eventBrand.push(item.value)
  })

  const data = {
    name: selectValue('advertisingTitle'),
    type: selectValue('bannerType'),
    image: UploadImgUrl || originalData.image,
    link: selectValue('advertisingLink'),
    startDate: new Date(startDate).toISOString().split("T")[0],
    endDate: new Date(endDate).toISOString().split("T")[0],
    enabled: document.querySelector('[name="advertisingStatus"]').checked,
    targetCompany: eventBrand
  }

  console.log("데이터", data)

  if (data.name === "") {
    alert("광고 제목을 입력해주세요.")
  } else if (data.image === "" && handlerType === "new") {
    alert("광고 이미지를 등록해주세요.")
  }
  // else if (data.link === "" || !checkUrl(data.link)) {
  //   data.link === ""
  //     ? alert("광고 링크를 등록해주세요.")
  //     : alert("올바른 링크를 입력해주세요. ex) https:// 혹은 http://로 시작되어야 합니다.")

  // } 
  else if (data.startDate === data.endDate) {
    // 시작일과 종료일이 같은 경우 경고 노출
    alert("광고 시작일과 종료일을 다르게 설정해주세요.")
  } else if (dateRemoveSecond(startDate) < dateRemoveSecond(new Date())) {
    // 시작일이 현재 날짜보다 이전일 경우 경고 노출
    alert("광고 시작일을 현재 날짜 및 시간 이후로 설정해주세요.")
    setStartDate(new Date()) // 시작일 현재 날짜로 자동 변경 처리
    setDateAlert(true)

  } else {

    setDateAlert(false)

    // 수정인 경우
    if (handlerType === "edit") {
      let changeWhether = false;
      let valueCheckDummy = { ...changeValue };

      Object.keys(data).forEach((valueTitle) => {
        console.log(JSON.stringify(originalData[valueTitle]), JSON.stringify(data[valueTitle]))
        if (
          (
            typeof originalData[valueTitle] === 'object' &&
            JSON.stringify(originalData[valueTitle]) !== JSON.stringify(data[valueTitle])
          )
          || (
            typeof originalData[valueTitle] !== 'object' &&
            originalData[valueTitle] !== data[valueTitle]
          )
        ) {
          changeWhether = true;
          valueCheckDummy[valueTitle] = true
          setChangeValue(valueCheckDummy)
          // console.log("변경항목", valueTitle)
        } else {
          valueCheckDummy[valueTitle] = false
          setChangeValue(valueCheckDummy)
        }
      })

      if (changeWhether) {
        setSubmitData(data)
        console.log("수정전 원본데이터", originalData)
        console.log("수정된데이터", data)
      } else {
        setSubmitData(null)
        alert("변경된 내용이 없습니다.")
      }

    }
    // 신규 등록인 경우
    else {
      const advertisementsPost = await Apis.post(`/api/advertisements`, data)
      if (advertisementsPost.data.status === "success") {
        alert("광고가 등록되었습니다.")
        location.href = "/advertising"
      } else {
        alert("광고 등록에 실패하였습니다.")
      }
      console.log(advertisementsPost)
      console.log(data)
    }
  }

}