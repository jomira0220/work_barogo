import PageTop from "@/components/PageTop/PageTop";
import { useRouter } from "next/router";
import styles from "./certification.module.scss";
import LayoutBox from "@/components/LayoutBox/LayoutBox";
import Button from "@/components/Button/Button";
import Apis from "@/utils/Apis";
import { useState } from "react";
import util from "util";
import bodyParser from "body-parser";
import FormatTime from "@/components/FormatTime";

export default function Certification(props) {
  const router = useRouter();
  const { brandCode, riderCode, hubCode, phoneNumber } = props.params;

  // ! 타이머 보여주기 여부
  const [timerShow, setTimerShow] = useState(true);
  // ! 타이머 남은 시간
  const [remainingTime, setRemainingTime] = useState(180);

  // ! 라이더앱에 푸시메시지 보내기
  const appPushHandler = async () => {
    const pushRes = await Apis.post("/api/accounts/authorize", {
      brandCode: brandCode,
      riderCode: riderCode,
      message: ""
    })
    console.log("푸시메시지 전송 결과", pushRes)
    if (pushRes.status === 200 && pushRes.data.data) {
      //인증번호가 발송완료
      setRemainingTime(180); // ! 인증번호 타이머 보여주기
    } else {
      alert("전송 실패 사유: ", pushRes.data.message)
    }
  }

  //!  푸시메시지 인증 완료 버튼 클릭시
  const VerifyHandler = async () => {

    // ! 푸시 번호 확인
    const verifyRes = await Apis.post(`/api/accounts/verify`, {
      riderCode: riderCode,
      verificationNumber: document.querySelector(`input[name="certificationNumber"]`).value,
    });

    console.log("푸시 번호 확인 api", verifyRes)

    if (verifyRes.status === 200 && verifyRes.data.status === "success") {
      // 푸시메시지 인증 성공 - 성공시 매핑 진행
      const mappingRes = await Apis.put(`/api/accounts/mapping`, {
        brandCode: brandCode,
        riderCode: riderCode,
        hubCode: hubCode,
        phoneNumber: props.params.phoneNumber
      });
      console.log("매핑 결과", mappingRes)

      if (mappingRes.status === 200 && mappingRes.data.status === "success") {
        router.push("/user/certification/success?brandCode=" + brandCode);
      } else {
        alert(mappingRes.data.message);
      }
    } else {
      // 푸시메시지 인증 실패
      alert(verifyRes.data.message);
    }
  };


  const backEvent = () => {
    document.querySelector(".cancelBackBtn").click();
  }

  return (
    <>
      <PageTop backPath={() => backEvent()}>본인 인증</PageTop>
      <div
        id={styles.brandCode}
        className={styles.certificationWarp}
        data-brand={brandCode}
      >
        <div className={styles.inner}>
          <p>
            <b>라이더앱</b>에 푸시 메시지를 전송했습니다.
            <br />
            전송된 인증번호를 입력해주세요.
          </p>
          <label htmlFor="certificationNumber">
            <div className={styles.title}>
              인증번호 입력
              <span className={styles.timer}>
                <FormatTime remainingTime={remainingTime} setRemainingTime={setRemainingTime} timerShow={timerShow} />
              </span>
            </div>
            <input type="number" inputMode='numeric' pattern='[0-9]*' placeholder="인증번호 입력" id="certificationNumber" name="certificationNumber" />
          </label>

          <Button variantStyle="color2" sizeStyle="sm" onClick={() => appPushHandler()}>
            푸시메시지 재전송
          </Button>
        </div>

        <div className={styles.bottomArea}>
          <form action="/user/riderCodeAgree" method="post">
            <input type="hidden" name="phoneNumber" defaultValue={phoneNumber} />
            <Button className="cancelBackBtn" variantStyle="darkgray" sizeStyle="lg" type="submit">
              계정 다시 선택
            </Button>
          </form>
          <Button variantStyle="color" sizeStyle="lg" onClick={() => VerifyHandler()}>
            인증 완료
          </Button>
        </div>
      </div>
    </>
  );
}

Certification.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export const getServerSideProps = async (context) => {
  const getBody = util.promisify(bodyParser.urlencoded());
  await getBody(context.req, context.res);
  const params = context.req.body;

  return {
    props: { params },
  };
};