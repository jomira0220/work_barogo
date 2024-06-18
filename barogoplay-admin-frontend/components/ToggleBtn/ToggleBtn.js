import { useState } from 'react';
import styles from './ToggleBtn.module.scss';

export default function ToggleBtn({ label, onClick, ...props }) {
    const [isToggled, toggle] = useState(false || props.defaultChecked)
    const toggleHandler = () => {
        toggle(!isToggled)
        onClick && onClick()
    }
    return (
        <div className={styles.toggleBtnWrap}>
            <label className={styles.toggleBtn}>
                <input type="checkbox" defaultChecked={isToggled} onClick={() => toggleHandler()} name={props.name} defaultValue={isToggled} />
                <span></span>
                <div className={styles.toggleText + (isToggled ? ` ${styles.On}` : ` ${styles.Off}`)}>{isToggled ? "ON" : "OFF"}</div>
            </label>
            <strong>{label}</strong>
        </div>
    )
}