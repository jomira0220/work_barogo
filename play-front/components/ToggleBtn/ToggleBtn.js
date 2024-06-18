import { useState } from 'react';
import styles from './ToggleBtn.module.scss';

export default function ToggleBtn({ label, toggled, onClick }) {
    const [isToggled, toggle] = useState(toggled === "true" ? true : false)

    const callback = () => {
        toggle(!isToggled)
        onClick(!isToggled)
    }

    return (
        <div className={styles.toggleBtnWrap}>
            <label className={styles.toggleBtn}>
                <input type="checkbox" defaultChecked={isToggled} onClick={() => callback()} />
                <span />
                <div className={styles.toggleText + (isToggled ? ` ${styles.On}` : ` ${styles.Off}`)}>{isToggled ? "ON" : "OFF"}</div>
            </label>
            <strong>{label}</strong>
        </div>
    )
}