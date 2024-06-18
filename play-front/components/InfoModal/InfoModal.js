import styles from "./InfoModal.module.scss"


export default function InfoModal(props) {
    const { title, subTitle, children } = props;
    // title: 제목
    // subTitle: 부제목
    // children: 내용
    return (
        <>
            <div className={styles.infoModalBox}>
                <div className={styles.infoIcon}></div>
                <h5>{title}</h5>
                {subTitle && <p>{subTitle}</p>}
            </div>
            {children}
        </>
    )
}