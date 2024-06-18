import { PieChart } from "react-minimal-pie-chart";
import TooltipMessage from '@/components/TooltipMessage';
import styles from "./ChallengeInfoBox.module.scss";
//! 챌린지 정보 노출 박스
export default function ChallengeInfoBox(props) {
  const { item, failCheck } = props;

  const start = item.startDate.replace(/-/g, ".").substring(2);
  const end = item.endDate.replace(/-/g, ".").substring(2);
  let challengePercent = Math.floor((item.progressCount / item.conditionValue) * 100);
  if (challengePercent > 100) challengePercent = 100;

  return (
    <>
      <div className={styles.challengeInfo + (failCheck ? ` ${styles.failStyle}` : "")}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.description}>
          <TooltipMessage message={item.description} />
        </div>
        <div className={styles.date}>
          {start} ~ {end}
        </div>
        <div className={styles.countNpoint}>
          <span className={styles.count}>
            {Number(item.progressCount).toLocaleString("ko-kr")} / {Number(item.conditionValue).toLocaleString("ko-kr")} 달성
          </span>
          <span className={styles.point}>
            보상 {Number(item.point).toLocaleString("ko-kr")}Exp
          </span>
        </div>
      </div>
      <div className={styles.pieChartBox}>
        <div
          className={
            styles.graphText +
            (challengePercent === 0
              ? ` ${styles.graphTextZero}`
              : "")
          }
        >
          <span className="blind">챌린지 달성률</span>
          <span>{challengePercent}</span>%
        </div>
        <PieChart
          data={[{
            value: challengePercent,
            color: "url(#gradient1)",
          },]}
          startAngle={-0}
          lengthAngle={-360}
          totalValue={102}
          lineWidth={20}
          labelStyle={{ fill: "var(--play-color-1)", }}
          labelPosition={0}
          background="var(--gray-color-2)"
          rounded
        >
          <defs>
            <linearGradient id="gradient1">
              <stop
                offset="0%"
                stopColor="var(--play-color-1)"
              />
              <stop
                offset="1000%"
                stopColor="var(--play-color-2)"
              />
            </linearGradient>
          </defs>
        </PieChart>
      </div>
    </>
  )
}