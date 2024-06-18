import Apis from "@/utils/Apis";
import Button from "@/components/Button/Button";
import Filter from 'badwords-ko';
import { badwordsData } from './badwordsData';
import { deleteCookie } from 'cookies-next';

// !닉네임 수정 관련
export const EditNickName = async (nameCheck, nickname, SetNameCheck, SetNickNameEditOpen, setNewUserData) => {
  const changeNameInputValue = document.querySelector(`input[name="nickname"]`) ? document.querySelector(`input[name="nickname"]`).value : "";

  if (nameCheck[0]) { // 닉네임 양식 체크를 통과하지 못했을때
    SetNameCheck([true, nameCheck[1]]);
  } else if (changeNameInputValue !== "") {// 닉네임 입력값이 있을때
    // !기존 닉네임과 변경할 닉네임이 같은지 체크
    let check = true
    if (nickname === changeNameInputValue) {
      SetNameCheck([true, "기존과 동일한 닉네임 입니다."]);
      return check = false;
    }

    if (check) {
      // !닉네임 변경 api 호출
      const nickNameCheck = await Apis.put(
        `/api/users/nickname?nickname=${changeNameInputValue}`
      );
      const nickNameCheckData = await nickNameCheck.data;
      if (nickNameCheckData.status === "error") {
        SetNameCheck([true, nickNameCheckData.message]);
      } else {
        alert("닉네임 변경이 완료되었습니다.");
        SetNickNameEditOpen(false);
        SetNameCheck([false, ""]);

        const refreshUserDataRes = await Apis.get("/api/users/me/account");
        const refreshUserData = await refreshUserDataRes.data.data;
        setNewUserData(refreshUserData);
      }
    }

  } else if (changeNameInputValue === "") { // 닉네임 입력값이 없을때
    SetNameCheck([true, "변경할 닉네임을 입력해주세요."]);
  }
};

//! 라이더 코드 해제
export const UnmappingHandler = async (setAlertModal, setNewUserData) => {
  const unmappingRes = await Apis.put("/api/accounts/unmapping");
  const unmappingData = await unmappingRes.data;
  // console.log("unmappingData", unmappingData)
  if (unmappingData.status === "success") {
    setAlertModal({
      onoff: true,
      text: (
        <>
          <h5>라이더 계정 연동이 해제되었습니다.</h5>
          <Button
            className="closeBtn"
            variantStyle="color"
            sizeStyle="lg"
            onClick={() => {
              setAlertModal({ onoff: false, text: "" });
              location.reload();
            }}
          >
            닫기
          </Button>
        </>
      ),
    });

    // !유저 데이터 다시 불러오기
    const refreshUserDataRes = await Apis.get("/api/users/me/account");
    const refreshUserData = await refreshUserDataRes.data.data;
    setNewUserData(refreshUserData);

  } else {
    setAlertModal({
      onoff: true,
      text: (
        <>
          <h5>라이더 계정 연동 해제에<br /> 실패하였습니다.</h5>
          <p>{unmappingData.message}</p>
          <Button
            variantStyle="color"
            sizeStyle="lg"
            onClick={() => setAlertModal({ onoff: false, text: "" })}
          >
            닫기
          </Button>
        </>
      ),
    });
  }
};

// !수정할 닉네임 입력 글자수 변경 처리 및 특수문자 포함여부 확인
export const StringCountChange = (value, SetNameCheck, setStringCount) => {

  // !비속어 포함 여부 체크
  const badwordsFilter = new Filter();
  badwordsFilter.addWords(...badwordsData) // 비속어 추가
  const badwordsCheck = badwordsFilter.clean(value);

  const emoji = /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/; // 이모지 체크 
  const specialRule = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gim; // 특수문자,괄호,점 체크 - 공백제외
  const emptyCheck = /\s/g;
  const brandCheckArr = [/MOACALL/i, /모아콜/, /라이더플레이/, /바로고/, /딜버/, /모아라인/, /RIDERPLAY/i, /BAROGO/i, /MOALINE/i, /DEALVER/i];


  //! 브랜드명 포함 여부 체크
  let brandCheck = true
  brandCheckArr.map((item) => {
    if (item.test(value)) {
      brandCheck = false
      SetNameCheck([true, "브랜드명은 닉네임으로 사용할 수 없습니다."]);
    }
  })

  let specialRuleCheck = false;
  // !특수문자 및 이모지 포함 여부 체크
  if (specialRule.test(value)) {
    console.log("특수문자")
    SetNameCheck([true, "특수문자는 포함할수 없습니다."]);
  } else {
    specialRuleCheck = true
  }

  let emojiCheck = false;
  if (emoji.test(value)) {
    console.log("이모지")
    SetNameCheck([true, "이모지는 포함할 수 없습니다."]);
  } else {
    emojiCheck = true
  }

  let emptyCheckCheck = false;
  if (emptyCheck.test(value)) {
    console.log("공백")
    SetNameCheck([true, "공백은 포함할 수 없습니다."]);
  } else {
    emptyCheckCheck = true
  }

  let badwordsCheckCheck = false;
  if (badwordsCheck !== value) {
    SetNameCheck([true, "비속어가 포함된 닉네임은 사용할 수 없습니다."]);
  } else {
    badwordsCheckCheck = true
  }

  if (value.length === 0) { // 입력값이 없을때 
    console.log("입력값 없음")
    SetNameCheck([false, ""]);
  }

  if (
    brandCheck === true
    && specialRuleCheck === true
    && emojiCheck === true
    && emptyCheckCheck === true
    && badwordsCheckCheck === true
  ) {
    console.log("정상")
    SetNameCheck([false, ""]);
  }

  setStringCount(value.length);
};


// !이메일 수정
export const EditEmail = async (emailCheck, SetEmailCheck, EmailEditOpen) => {
  const changeEmailInputValue = document.querySelector(`input[name='email']`)
    ? document.querySelector(`input[name='email']`).value : "";
  if (EmailEditOpen && changeEmailInputValue !== "") {
    if (emailCheck === '사용 가능한 이메일입니다.') {
      const emailCheckRes = await Apis.put(
        `/api/users/email?email=${changeEmailInputValue}`
      );
      const emailCheckData = await emailCheckRes.data;
      // console.log("emailCheckData", emailCheckData)
      if (emailCheckData.status === "error") {
        alert(emailCheckData.message);
      } else {
        alert("이메일 변경이 완료되었습니다.");
        location.reload();
      }
    }
  } else if (EmailEditOpen && changeEmailInputValue === "") {
    SetEmailCheck("변경할 이메일을 입력해주세요.");
  }
}


// !탈퇴하기
export const SecessionHandler = (setAlertModal) => {

  const secessionOut = async () => {
    const secessionRes = await Apis.delete("/api/users/me");
    const secessionData = await secessionRes.data;
    // console.log("secessionData", secessionData)
    if (secessionData.status === "success") {
      alert("탈퇴가 완료되었습니다.");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      location.href = `${process.env.NEXT_PUBLIC_DOMAIN_URL}`;
      SignOut();
    } else {
      alert("탈퇴에 실패하였습니다.");
    }
  }

  setAlertModal({
    onoff: true,
    text: (
      <>
        <h5>라이더 플레이를 <br />정말로 탈퇴하시겠습니까?</h5>
        <div className="buttonWrap">
          <Button
            variantStyle="color"
            sizeStyle="lg"
            onClick={() => secessionOut()}>
            탈퇴하기
          </Button>
          <Button
            variantStyle="darkgray"
            sizeStyle="lg"
            onClick={() => setAlertModal({ onoff: false, text: "" })}
          >
            닫기
          </Button>
        </div>
      </>
    ),
  });
};



// !닉네임 또는 이메일 수정창 열기
export const ModifyOpenHandler = (type, NickNameEditOpen, SetNickNameEditOpen, SetNameCheck, setStringCount, SetEmailEditOpen, EmailEditOpen, SetEmailCheck) => {
  if (type === "nickName") {
    SetNickNameEditOpen(!NickNameEditOpen); // 닉네임 수정창 열기 또는 닫기
    SetNameCheck([false, ""]); // 닉네임 수정시 안내문구 초기화
    setStringCount(0); // 수정 요청 아이디 입력 글자수 초기화
  } else if (type === "email") {
    SetEmailEditOpen(!EmailEditOpen); // 이메일 수정창 열기 또는 닫기
    SetEmailCheck(""); // 이메일 수정시 안내문구 초기화
  }
};


// !모달 닫기 및 새로고침 체크
export const ReloadCloseCheck = (setAlertModal) => {
  const closeBtn = document.querySelector(".closeBtn")
  if (closeBtn) {
    // 라이더 계정 연동 해제 버튼 클릭 처리 (맵핑 해제 처리) 
    closeBtn.click();
  } else {
    setAlertModal({ onoff: false, text: "" });
  }
}