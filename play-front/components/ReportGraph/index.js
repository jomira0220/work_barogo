import styles from "./ReportGraph.module.scss";
import InfoDetailBtn from "@/components/InfoDetailBtn/InfoDetailBtn";
import { useEffect } from 'react';
import styled, { keyframes } from "styled-components";

const heightAnimation = (height) => keyframes`
0% {
  height: 0;
}
100% {
  height: ${height || 0};
}`;

const EarningPointBox = styled.div`
font-size: var(--small-font-size);
position: relative;
height: 0;
overflow: hidden;
animation: 0.5s ${(props) => heightAnimation("40px")} ease-in 1.5s forwards;
color: var(--play-color-2);
font-size: var(--xsmall-font-size);

.color{
display: block;
background-color: var(--play-color-3);
font-weight: 500;
padding:var(--space-0) var(--space-1);
border-radius: var(--space-1);
margin-bottom: 5px;
}

.max{
font-size: 10px;
color: var(--play-color-1);
}
`

const BarBox = styled.div`
width: 50px;
margin: 5px auto 10px;
border-radius: 10px 10px 0 0;
background-color: ${(props) => props.$backColor};
animation: 0.5s ${(props) => heightAnimation(props.$avgPer + "%")} ease-out 0.5s
  forwards;
`;

const BarLineBox = styled.div`
display: block;
width: 100%;
animation: 0.5s ${(props) => heightAnimation(props.$avgPer + "%")} ease-out 0.5s
  forwards;
background-color: rgba(91, 91, 91, 0.05);
position: absolute;
bottom: 25px;
left: 0;
border-top: 1px dashed #ccc;
`;

export default function ReportGraph(props) {

  // 콘솔 경고 방지용 더미 컴포넌트
  const EarningPoint = ({ children }) => {
    return (
      <EarningPointBox>{children}</EarningPointBox>
    )
  }

  const BarLine = (props) => {
    return (
      <BarLineBox $avgPer={props.$avgPer} />
    )
  }

  const Bar = (props) => {
    return (
      <BarBox $avgPer={props.$avgPer} $backColor={props.$backColor} />
    )
  }


  // 평균 배달 건수, 라이더 배달 건수
  const { totalAverage, deliveryCount, graphInfoTitle, nickname, brandCheck, earningPoint } =
    props;

  // console.log(props);

  // avgCount: 평균 배달 건수 소수점 제거
  const avgCount = Math.floor(totalAverage);

  // riderCount: 라이더 배달 건수
  const riderCount = deliveryCount || 0;

  // 최대 배달 건수는 주어진 데이터 중 가장 큰 값의 3배로 설정
  const maxDeliveryCount = avgCount > riderCount ? avgCount * 3 : riderCount * 3;

  // 최대 배달 건수 대비 브랜드 평균 배달 건수 비율
  const dayAvgPer = parseInt((avgCount / maxDeliveryCount) * 100) || 0;

  // 최대 배달 건수 대비 유저의 배달 건수 비율
  const dayRiderAvgPer = parseInt((riderCount / maxDeliveryCount) * 100) || 0;

  // 숫자 올라가는 카운터 애니메이션 처리용 함수
  const counter = (className, max) => {
    const el = document.querySelector(className);
    // console.log(el, className)
    if (el === null) return;
    let now = max;
    const handle = setInterval(() => {
      el.innerHTML = (Math.ceil(max - now)).toLocaleString("ko-KR") + "건";

      // 목표수치에 도달하면 정지
      if (now < 1) {
        clearInterval(handle);
      }
      // 증가되는 값이 계속하여 작아짐
      const step = now / 10;

      // 값을 적용시키면서 다음 차례에 영향을 끼침
      now -= step;
    }, 20);
  }

  useEffect(() => {
    counter(".avgCountNumber", avgCount);
    counter(".riderCountNumber", riderCount);
  }, [avgCount, riderCount]);



  return (
    <div className={styles.avgWrap}>
      <div className={styles.avgBox}>
        <div className={styles.graphInfo}>
          <b className={styles.graphInfoTitle}>{graphInfoTitle}</b>
          <InfoDetailBtn className={styles.infoBtn}>
            <h5>배달리포트란?</h5>
            <b>
              가입일 이후부터 매일 오후 2시, 전날 0시~24시
              <br />배달 기록이 업데이트 됩니다.
              <span style={{ marginBottom: "10px", display: "block" }}></span>
              배달 1건에 1Exp가 부여되고,
              <br />하루 최대 50Exp를 획득할 수 있습니다
            </b>
          </InfoDetailBtn>
        </div>



        <div className={styles.graphBox}>
          <BarLine $avgPer={dayAvgPer} />
          <div className={styles.dataBar}>
            <span className={styles.dataBarNum + " avgCountNumber"}></span>
            <Bar $avgPer={dayAvgPer} $backColor="var(--black-color-1)" />
            <span>라이더플레이 평균</span>
          </div>

          <div className={styles.dataBar}>
            {earningPoint > 0 && (
              <EarningPoint>
                <span className="max" style={{ opacity: earningPoint === 50 ? "1" : "0" }}>MAX</span>
                <span className="color">보상 {earningPoint.toLocaleString("ko-KR")}Exp</span>
              </EarningPoint>
            )
            }
            <span className={`${styles.dataBarNum} ${styles.rider} riderCountNumber`}></span>
            <Bar $avgPer={dayRiderAvgPer} $backColor="var(--play-color-1)" />
            <span>{nickname}님</span>
          </div>
        </div>
      </div>
      <p className={styles.avgTextBox}>
        {avgCount > riderCount ? (
          <>
            라이더플레이 평균보다 <b>{(avgCount - riderCount).toLocaleString("ko-KR")}건 낮아요!</b>
          </>
        ) : avgCount < riderCount ? (
          <>
            라이더플레이 평균보다 <b>{(riderCount - avgCount).toLocaleString("ko-KR")}건 높아요!</b>
          </>
        ) : (
          avgCount === riderCount && (
            <>
              라이더플레이 <b>평균과 같아요!</b>
            </>
          )
        )}
      </p>
    </div>
  );
}
