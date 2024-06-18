import { QuestionMarkIcon, LineBasicClose } from "@/components/Icon/Icon";
import styles from './InfoDetailBtn.module.scss';
import { useState } from "react";


export default function InfoDetailBtn({ color, children, className, infoBoxClassName, ...props }) {
    const [infoDetailHide, setInfoDetailShow] = useState(false);
    const infoDetailShow = () => {
        setInfoDetailShow(!infoDetailHide)
    }

    return (
        <>
            <button
                className={`${styles.infoBtn}` + (className ? ` ${className}` : "")}
                onClick={() => infoDetailShow()}
            >
                <QuestionMarkIcon color={color} />
            </button>
            {infoDetailHide && (
                <>
                    <div className={styles.infoDetailBox} onClick={() => setInfoDetailShow(false)}></div>
                    <div className={styles.infoDetailInner}>
                        <div className={styles.infoDetail + (infoBoxClassName === undefined ? "" : ` ${infoBoxClassName}`)}>
                            <button className={styles.closeBtn} onClick={() => infoDetailShow()} >
                                <LineBasicClose />
                                <span className='blind'>닫기 버튼</span>
                            </button>
                            {children}
                        </div>
                    </div>
                </>
            )
            }
        </>
    )
}

