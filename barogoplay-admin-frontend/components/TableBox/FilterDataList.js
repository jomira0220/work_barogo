import styles from "./TableBox.module.scss";
import { stringKrChange } from "@/components/utils/stringKrChange";

// ! 검색 결과 저장시 적용한 필터 내용 팝업에서 한번 더 확인 노출하는 컴포넌트 - 24.06.14 사용안하고 있음
export default function FilterDataList({ filterTotalData, filterCategory }) {

  const filterDataListArr = {}
  let arr = []
  Object.keys(filterTotalData).filter(
    item => item !== "size" && item !== "sort" && item !== "page"
  ).forEach((item, index) => {
    if (item.includes("Start") || item.includes("End")) {
      arr.push(filterTotalData[item])
    } else {
      filterDataListArr[item] = filterTotalData[item]
    }
    if (arr.length === 2) {
      const itemName = item.includes("Start")
        ? item.replace("Start", "")
        : item.includes("End") && item.replace("End", "")

      if (!(arr[0] === 0 && arr[1] === 0)) filterDataListArr[itemName] = arr
      arr = []
    }
  })
  return (
    <div className={styles.memberListSearchResult}>
      {Object.keys(filterDataListArr).map((item, index) => {
        return (
          <div key={index} className={styles.resultFilterList}>
            <span className={styles.title}>{stringKrChange[filterCategory][item] || item}</span>
            <span>
              {
                item.includes("Date") || item.includes("Point") || item.includes("Count")
                  ? filterDataListArr[item].join(" ~ ")
                  : typeof filterDataListArr[item] === "object" ? filterDataListArr[item].join(", ") : filterDataListArr[item]
              }
            </span>
          </div>
        )
      })}
    </div>
  )
}