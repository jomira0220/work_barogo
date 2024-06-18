
import styles from './TableBox.module.scss'
import { stringKrChange } from "@/components/utils/stringKrChange";

//숫자 필터 노출용 컴포넌트
export default function NumberTableFilter({ name, filterCategory, filterTotalData, setFilterChangeCheck, query }) {

  const queryStartName = name + "Start"
  const queryEndName = name + "End"

  return (
    <div className={styles.numberFilterItem}>
      <span className={
        styles.numberFilterHead + (stringKrChange[filterCategory][name].includes("포인트") ? " " + styles.color : "")}>
        <b>{stringKrChange[filterCategory][name]}</b>
      </span>
      <input
        className={styles.filterInput}
        type="number"
        name={`${name}Start`}
        defaultValue={query[queryStartName] ? Number(query[queryStartName]) : 0}
        onChange={(e) => {
          filterTotalData[name + "End"] = e.target.value
          setFilterChangeCheck(true)
        }}
        placeholder={`이상`}
      />
      <span>~</span>
      <input
        className={styles.filterInput}
        type="number"
        name={`${name}End`}
        defaultValue={query[queryEndName] ? Number(query[queryEndName]) : 0}
        onChange={(e) => {
          filterTotalData[name + "End"] = e.target.value
          setFilterChangeCheck(true)
        }}
        placeholder={`이하`}
      />
    </div>
  )
}



