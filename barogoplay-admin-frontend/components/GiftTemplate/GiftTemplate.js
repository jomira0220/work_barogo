import styles from './GiftTemplate.module.scss'

export default function GiftTemplate(props) {
  const { templateData } = props
  return (
    <ul className={styles.giftTemplateDetailList}>
      {Object.keys(templateData).map((item, index) => {
        return (
          <li key={index}>
            <span>{item}</span>
            <span>{Object.values(templateData)[index]}</span>
          </li>
        )
      })}
    </ul>
  )
}