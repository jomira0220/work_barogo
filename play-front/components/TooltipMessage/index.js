import styles from './TooltipMessage.module.scss'

// 툴팁 메시지 내용 처리
export default function TooltipMessage({ ...props }) {

  let { message } = props
  let messageDummy = message
  // console.log("messageDummy", messageDummy)

  // message = "{{심야시간 : 오후10시~오전 8시59분}} 배달건수 {{50건}}이상 테스트"

  const TooltipToggle = (e) => {
    e.currentTarget.classList.toggle(styles.active)
  }

  if (message.indexOf("{{") !== -1 && message.indexOf("}}") !== -1) {
    // 메세지에 {{ }}가 있는 경우
    // 메세지 예시 폼 : "{{심야시간 : 오후 00:00 ~ 오전 00:00을 기준으로 합니다}} 배달건수 {{50건}}이상 테스트"
    const messageDescription = message.split("{{").filter(item => item.includes("}}")).map((item, i) => {
      const itemKey = item.split("}}")[0]

      const tipKey = itemKey.substring(0, itemKey.indexOf(":")).slice(0, -1)
      const tipValue = itemKey.substring(itemKey.indexOf(":")).indexOf(":") !== -1
        ? itemKey.substring(itemKey.indexOf(":") + 1)
        : itemKey

      const itemValue = item.split("}}")[1]

      const value = tipKey ? tipKey : tipValue
      messageDummy = messageDummy.replace("{{" + itemKey + "}}", value)

      return (
        <span key={i}>
          <b
            onClick={(e) => TooltipToggle(e)}
            className={styles.tooltipBox + (value !== tipValue ? ` ${styles.color}` : "")}
          >
            {value}
            {value !== tipValue && (
              <span className={styles.tooltipText}>
                {tipValue}
              </span>
            )}
          </b>
          {itemValue}
        </span>
      )
    })

    return messageDescription
  } else {
    // 메세지에 {{ }}가 없는 경우 툴팁 없음
    return messageDummy
  }
}