

import { useEffect } from "react";
export default function FormatTime(props) {

  const { remainingTime, setRemainingTime, timerShow } = props;

  useEffect(() => {
    let timer
    if (timerShow) {
      //useEffect를 사용하여 컴포넌트가 마운트될 때 타이머 시작.
      timer = setInterval(() => {
        // 남은 시간이 0보다 크면 1초씩 감소시킴.
        if (remainingTime > 0) {
          setRemainingTime((prevTime) => prevTime - 1);
        } else {
          // 남은 시간이 0이 되면 타이머 정지.
          clearInterval(timer);
        }
      }, 1000);
      // 컴포넌트가 언마운트되면 타이머 정지
      return () => clearInterval(timer);
    } else {
      clearInterval(timer)
    }
  }, [remainingTime, timerShow, setRemainingTime]);

  const FormatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    let result = `${String(minutes).padStart(1, "0")}분 ${String(seconds).padStart(2, "0")}초`;
    if (
      String(minutes).padStart(1, "0") === "0" &&
      String(seconds).padStart(2, "0") === "00"
    ) {
      result = "시간 초과";
    }
    return result;
  };

  return (FormatTime(remainingTime))
}

