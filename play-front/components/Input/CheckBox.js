import styles from './CheckBox.module.scss';
import { CheckBoxIcon } from "@/components/Icon/Icon";
export default function CheckBox({ children, defaultChecked, ...restProps }) {
    return (
        <label className={styles.checkboxLabel}>
            <CheckBoxIcon onoff={String(defaultChecked || false)} />
            <input type="checkbox" defaultChecked={defaultChecked} {...restProps} />
            {children}
        </label>
    )
}