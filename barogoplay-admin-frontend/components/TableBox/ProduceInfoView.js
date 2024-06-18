import styles from "./TableBox.module.scss";
import Image from "next/image";
// 테이블 데이터 노출시 게시글 메타 데이터 노출용
export default function ProduceInfoView(props) {
  const { itemValue, stringKrChange, filterCategory } = props
  return (Object.keys(itemValue).map((key, index) => {
    const valueImgCheck = String(itemValue[key]).includes("http") ? true : false
    return (
      <div key={index} className={styles.infoItem}>
        <div className={styles.title}>{stringKrChange[filterCategory][key] || key}</div>
        <div className={styles.content}>{
          valueImgCheck
            ? <Image src={itemValue[key]} width={70} height={70} alt={key} />
            : stringKrChange[itemValue[key]]
              ? stringKrChange[itemValue[key]]
              : key.includes("Price")
                ? itemValue[key].toLocaleString("ko-KR") + "원"
                : itemValue[key]
                  ? typeof itemValue[key] === "object" && itemValue[key].length === 0
                    ? "내용없음"
                    : itemValue[key]
                  : "내용없음"
        }</div>
      </div>
    )
  }))
}