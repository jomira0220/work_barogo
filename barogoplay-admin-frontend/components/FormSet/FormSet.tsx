import styles from "@/styles/form.module.scss";
import { useState } from "react";
import DatePickerBox from "@/components/DatePickerBox/DatePickerBox";
import Button from "@/components/Button/Button";
import Apis from "@/components/utils/Apis";
import Image from "next/image";
import { useRouter } from "next/router";
import { LineBasicArrow } from "@/components/Icon/Icon";
import SaveMemberListChoicePop from "@/components/SaveMemberListChoicePop";
import {
  FormWarpProps,
  StyleBoxProps,
  SentInputProps,
  SentDateProps,
  SentTargetProps,
  SentContentProps,
} from "@/interfaces";

export function Line() {
  return <div className={styles.line}></div>;
}

export function FormWarp({ children, ...props }: FormWarpProps) {
  return (
    <div className={styles.formWarp} {...props}>
      {children}
    </div>
  );
}

export function StyleBox({
  children,
  styletype,
  title,
  ...props
}: StyleBoxProps) {
  return (
    <div
      className={
        styletype === "line"
          ? styles.lineBox
          : styletype === "checkBoxWarp"
          ? styles.checkBoxWarp
          : styles.typeBox
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function SentDate({ title, ...props }: SentDateProps) {
  return title ? (
    <div className={styles.dateBox}>
      <h3>
        {title}
        {props.info && <span className={styles.noticeSpan}>{props.info}</span>}
      </h3>
      <DatePickerBox {...props} />
    </div>
  ) : (
    <DatePickerBox {...props} />
  );
}

export function SentTarget({
  FileView,
  setFileView,
  limitCount,
  readOnly,
  ...props
}: SentTargetProps) {
  // FileView : 저장된 회원 데이터
  // setFileView : 저장된 회원 데이터 변경 함수
  // limitCount : 발송가능수량(api로 받아온 값)
  // readOnly : 읽기전용인지 여부

  const [memberListPopup, setMemberListPopup] = useState(false);

  const popClose = () => {
    setMemberListPopup(false);
  };

  // 전체 회원 중 선택인 경우 브랜드 선택 박스 노출 처리용
  const [BrandSetShow, setBrandSetShow] = useState(true);

  //! 전체 회원중 선택인 경우 파일뷰 초기화
  const radioCheckSet = (e) => {
    if (e.target.checked) {
      setBrandSetShow(true); // 브랜드 선택 박스 노출
      setFileView(null);
    }
  };

  let processedUserList,
    processedUserListCount,
    repeatedUserList,
    repeatedUserListCount,
    unExistUsersList,
    unExistUsersListCount;
  if (FileView !== null) {
    // 발송될 회원리스트
    processedUserList = FileView.data.processedUserList;
    processedUserListCount = Number(processedUserList.length).toLocaleString(
      "ko-KR"
    );
    // 중복된 회원리스트
    repeatedUserList = FileView.data.repeatedUsers.userList;
    repeatedUserListCount = Number(repeatedUserList.length).toLocaleString(
      "ko-KR"
    );
    // 존재하지 않는(탈퇴) 회원리스트
    unExistUsersList = FileView.data.unExistUsers.userList;
    unExistUsersListCount = Number(unExistUsersList.length).toLocaleString(
      "ko-KR"
    );
  }

  // 업로드한 회원리스트 테이블 토글 처리용
  const ToggleTableBox = (e) => {
    e.currentTarget.children[1].classList.toggle(styles.active);
  };

  // 발송할 유저 테이블 리스트 노출용 컴포넌트
  const UserListTable = ({ title, userList }) => {
    const userListCount = Number(userList.length).toLocaleString("ko-KR");
    return (
      <div className={styles.toggleTableBox} onClick={(e) => ToggleTableBox(e)}>
        <h4>
          {title}({userListCount + "명"})
          {userList.length > 0 && <LineBasicArrow />}
        </h4>
        <div className={styles.viewTableStyle}>
          <div className={styles.viewTableInner}>
            <table>
              <thead>
                <tr>
                  <th>회원코드</th>
                  <th>브랜드코드</th>
                  <th>닉네임</th>
                  <th>허브코드</th>
                  <th>유저아이디</th>
                  <th>라이더코드</th>
                  <th>가입일</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.id ? item.id : "-"}</td>
                      <td>{item.brandCode ? item.brandCode : "-"}</td>
                      <td>{item.nickname ? item.nickname : "-"}</td>
                      <td>{item.hubCode ? item.hubCode : "-"}</td>
                      <td>{item.username ? item.username : "-"}</td>
                      <td>{item.riderCode ? item.riderCode : "-"}</td>
                      <td>{item.createdDate ? item.createdDate : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const sentName = props.name === "badgeGrantTarget" ? " 배지 부여" : "발송";
  // ! 발송 타켓을 전체회원중에서 선택시 보여줄 라디오 박스 (미연동, 바로고, 딜버, 모아라인)
  const MessageTargetBrand = (props) => {
    const { readOnly, FileView } = props;
    const messageTargetBrandValueList = {
      unMapped: "미연동",
      BAROGO: "바로고",
      DEALVER: "딜버",
      MOALINE: "모아라인",
    };
    return Object.keys(messageTargetBrandValueList).map((item, index) => {
      return (
        <label
          htmlFor={item !== "unMapped" ? `brand_${item}` : item}
          key={index}
        >
          <input
            id={item !== "unMapped" ? `brand_${item}` : item}
            type="checkbox"
            name="messageTargetBrand"
            value={item.toUpperCase()}
            readOnly={readOnly ? true : false}
            disabled={FileView !== null && readOnly ? true : false}
          />
          {messageTargetBrandValueList[item]}
        </label>
      );
    });
  };

  return (
    <>
      <div className={styles.radioBox}>
        {props.name === "badgeGrantTarget" ? (
          <SaveMemberListChoicePop
            setFileView={setFileView}
            popClose={popClose}
            type="box"
          />
        ) : (
          <>
            <h3>발송 대상</h3>
            <fieldset className={styles.targetBox}>
              <div
                style={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <label htmlFor="allMember">
                  <input
                    id="allMember"
                    type="radio"
                    name="messageTarget"
                    value="allMember"
                    readOnly={readOnly ? true : false}
                    defaultChecked={FileView === null ? true : false}
                    disabled={FileView !== null && readOnly ? true : false}
                    onChange={(e) => radioCheckSet(e)}
                  />
                  {props.name === "giftSentTarget"
                    ? "전체 회원"
                    : "전체 회원 중 선택"}
                </label>
                {/* 
                  전체 회원중 선택 클릭시에만 브랜드 선택지 노출 
                  선물하기의 경우에는 브랜드 선택지 노출하지 않음
                */}

                {props.name !== "giftSentTarget" && BrandSetShow && (
                  // 전체 회원중 선택시 체크할 항목들 노출
                  <div className={styles.targetForm}>
                    <MessageTargetBrand
                      readOnly={readOnly}
                      FileView={FileView}
                    />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="saveListMember">
                  <input
                    type="radio"
                    id="saveListMember"
                    name="messageTarget"
                    value="saveListMember"
                    readOnly={readOnly ? true : false}
                    defaultChecked={FileView !== null ? true : false}
                    disabled={FileView !== null && readOnly ? true : false}
                    onClick={() => setMemberListPopup(true)}
                    onChange={(e) =>
                      e.target.checked
                        ? setBrandSetShow(false)
                        : setBrandSetShow(true)
                    }
                  />
                  저장된 회원리스트 선택
                  <span className={styles.buttonSt}>회원리스트 선택</span>
                </label>
              </div>
            </fieldset>
            {/* 저장된 회원리스트 선택 업로드 팝업 */}
            {memberListPopup && (
              <SaveMemberListChoicePop
                setFileView={setFileView}
                popClose={popClose}
                type="popup"
              />
            )}
          </>
        )}

        {FileView && (
          <div
            className={
              styles.fileView + (readOnly ? " " + styles.marginZero : "")
            }
          >
            {limitCount && FileView.data.length > limitCount && (
              // 선물하기 관련임
              <p className={styles.limitCount}>
                발송 대상 : {processedUserListCount}명 / 발송가능수량 :{" "}
                {limitCount}명
                <br />
                <span>
                  *선물 메시지 발송 대상자가 발송가능수량을 초과하여 발송이
                  불가능합니다.
                </span>
              </p>
            )}
            <div className={styles.fileInfo}>
              <p>
                {sentName} 대상 :{" "}
                <span className={styles.fileCount}>
                  {" "}
                  총 {processedUserListCount}명{" "}
                </span>
                / 중복된 회원 : {repeatedUserListCount}명 제외 / 탈퇴한 회원 :{" "}
                {unExistUsersListCount}명 제외
              </p>
            </div>

            {/* 중복된 회원리스트 */}
            {repeatedUserList && repeatedUserList.length > 0 && (
              <UserListTable title="중복된 회원" userList={repeatedUserList} />
            )}

            {/* 존재하지 않는 회원리스트 */}
            {unExistUsersList && unExistUsersList.length > 0 && (
              <UserListTable title="탈퇴 회원" userList={unExistUsersList} />
            )}

            {/* 발송할 회원리스트 */}
            {processedUserList && processedUserList.length > 0 && (
              <UserListTable
                title={sentName + "될 회원"}
                userList={processedUserList}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
}

export function SentContent({
  title,
  limitCount,
  maxLength,
  placeholder,
  defaultValue,
  inputInfo,
  ...props
}: SentContentProps) {
  const [textValue, setTextValue] = useState(
    defaultValue ? defaultValue.length : 0
  );
  const handSetTextArea = (e) => {
    setTextValue(e.target.value.length);
  };
  const count = maxLength || limitCount || 30;
  return (
    <div className={styles.textAreaBox}>
      {title && (
        <h3>
          {title}{" "}
          {inputInfo ? (
            <span className={styles.noticeSpan}>{inputInfo}</span>
          ) : (
            ""
          )}
        </h3>
      )}
      <textarea
        placeholder={placeholder || "내용을 입력해주세요"}
        maxLength={count}
        onChange={(e) => {
          handSetTextArea(e);
        }}
        defaultValue={defaultValue}
        {...props}
      ></textarea>
      <span
        className={styles.textAreaCount}
      >{`( ${textValue} / ${count}자 )`}</span>
    </div>
  );
}

export function SentInput({
  title,
  styletype,
  className,
  inputInfo,
  ...props
}: SentInputProps) {
  // !숫자 입력형 인풋이면 콤마 찍기 및 숫자만 입력 처리
  const pointKeyUp = (e) => {
    const input = e.target;
    const value = Number(input.value.replaceAll(",", ""));
    if (isNaN(value)) {
      input.value = 0;
    } else {
      input.value = value.toLocaleString("ko-KR");
    }
  };

  return (
    <div
      className={
        styletype === "line"
          ? styles.lineBox
          : styletype === "requiredInput"
          ? styles.requiredInputBox
          : ""
      }
    >
      {title && (
        <h3>
          {title}{" "}
          {inputInfo && <span className={styles.noticeSpan}>{inputInfo}</span>}
        </h3>
      )}
      <input
        className={className === "numberSet" ? styles.numberSet : ""}
        onChange={(e) => (className === "numberSet" ? pointKeyUp(e) : null)}
        {...props}
      />
    </div>
  );
}

export function SentType({ title, name, typeList, ...props }) {
  // title:"발송유형선택",
  // name:"messageType"
  // typeList:[
  //   {type:"일반 메시지형", value="message", defaultChecked:true},
  //   {type:"경험치 지급형", value="point"},
  // ]

  return (
    <div className={styles.radioBox}>
      <h4>{title}</h4>
      <fieldset className={styles.typeChoice}>
        {typeList.map((item, index) => {
          return (
            <div key={index}>
              <input
                {...props}
                id={item.value + "Type"}
                type="radio"
                name={name}
                value={item.value}
                defaultChecked={item.defaultChecked || false}
              />
              <label htmlFor={item.value + "Type"}>{item.type}</label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
}

// !수정된 데이터 확인용 컴포넌트
export function EditDataCheckBox(props) {
  const router = useRouter();
  const { originalData, submitData, changeValue, type, id } = props;

  const krChange = {
    image: "이미지",
    name: "이름",
    point: "경험치",
    description: "배지설명",
    conditionDescription: "배지조건설명",
    startDate: "시작일",
    endDate: "종료일",
    conditionType: "조건",
    conditionValue: "조건값",
    targetCompany: "적용 브랜드",
    details: "조건 상세",
    enabled: "활성여부",
    challengeType: "챌린지 유형",
    conditions: "챌린지 조건",
    link: "링크",
  };

  // 데이터 값 노출 처리
  const itemValue = (data, item) => {
    let value = data[item];
    // console.log(value)
    const result =
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
        ? String(value) // 값이 배열이나 객체가 아닌 경우
        : value === "" || value === null || value === undefined
        ? "없음"
        : typeof value === "object" &&
          value !== null &&
          value.length > 0 &&
          item !== "targetCompany" // 브랜드는 제외
        ? // 거리이거나 시간대 노출인 경우
          value.map((valueDetail, index) => {
            const type = valueDetail.type === "DISTANCE" ? "거리" : "시간대";
            const text1 =
              valueDetail.type === "DISTANCE" ? "km 이상" : "시부터";
            const text2 =
              valueDetail.type === "DISTANCE" ? "km 이하" : "시까지";
            return (
              <span key={index}>
                {type} {valueDetail.value1 + text1}{" "}
                {valueDetail.value2 && valueDetail.value2 + text2}
              </span>
            );
          })
        : item === "targetCompany"
        ? value.join(", ") // 브랜드인 경우
        : "없음";

    return result;
  };

  const ModifySave = async (type) => {
    // type : "badge" 또는 "challenge" 또는 "advertising"
    // id : 수정할 데이터의 id
    // submitData : 수정할 데이터

    if (type !== "advertising") {
      let submitDataSet = { ...submitData };
      submitDataSet.image === null ||
        (submitDataSet.image === "" && (submitDataSet.image = "없음"));
      const ModifyRes = await Apis.put(`/api/${type}s/${id}`, submitDataSet);
      console.log(`${type} 수정 api`, ModifyRes);

      if (ModifyRes.status === 200 && ModifyRes.data.status === "success") {
        alert("수정이 완료되었습니다.");
        router.push(`/activity/${type}/${type}Management`);
      } else {
        alert(`수정에 실패하였습니다. 사유 : ${ModifyRes.data.message}`);
      }
    } else {
      // 광고 수정인 경우
      const advertisementsRes = await Apis.put(
        `/api/advertisements/${id}`,
        submitData
      );
      console.log(`광고 수정 api`, advertisementsRes);
      if (
        advertisementsRes.status === 200 &&
        advertisementsRes.data.status === "success"
      ) {
        alert("수정이 완료되었습니다.");
        router.push(`/advertising`);
      } else {
        alert(
          `수정에 실패하였습니다. 사유 : ${advertisementsRes.data.message}`
        );
      }
    }
  };

  return (
    <>
      <div className={styles.jsonDataWarp}>
        <div className={styles.jsonTitle}>
          <span>항목</span>
          <span>원본</span>
          <span>수정</span>
        </div>
        <ul className={styles.jsonItemList}>
          {Object.keys(originalData).map((item, index) => {
            const originalValue = itemValue(originalData, item);
            const newValue = itemValue(submitData, item);
            return (
              <li
                key={index}
                className={
                  styles.dataCompare +
                  (changeValue[item] ? " " + styles.change : "")
                }
              >
                <div className={styles.title}>{krChange[item] || item}</div>
                <div>
                  {item === "image" && originalData[item].includes("http") ? (
                    <Image
                      src={originalData[item]}
                      width="50"
                      height="50"
                      alt=""
                    />
                  ) : (
                    <span>{originalValue}</span>
                  )}
                </div>
                <div>
                  {item === "image" && submitData[item].includes("http") ? (
                    submitData[item] ? (
                      <Image
                        src={submitData[item]}
                        width="50"
                        height="50"
                        alt=""
                      />
                    ) : (
                      <span>없음</span>
                    )
                  ) : (
                    <span>{newValue}</span>
                  )}
                  {changeValue[item] ? (
                    <div className={styles.infoBox}>수정</div>
                  ) : (
                    ""
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.checkModify}>
        <p>
          수정된 내용이 맞는지 확인 후 <br />
          <b>
            수정 완료를 눌러야만 최종적으로
            <br />
            수정이 완료됩니다.
          </b>
        </p>
        <Button
          variantStyle="color"
          sizeStyle="sm"
          onClick={() => ModifySave(type)}
        >
          수정 완료
        </Button>
      </div>
    </>
  );
}
