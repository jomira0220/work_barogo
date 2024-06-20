import { useState } from "react";
import styles from "./ToggleBtn.module.scss";

interface ToggleBtnProps {
  label: string;
  onClick?: () => void;
  defaultChecked?: boolean;
  name?: string;
}

const ToggleBtn: React.FC<ToggleBtnProps> = ({ label, onClick, ...props }) => {
  const [isToggled, toggle] = useState<boolean>(false);
  const toggleHandler = () => {
    props.defaultChecked === undefined
      ? toggle(!isToggled)
      : toggle(!props.defaultChecked);
    onClick && onClick();
  };
  return (
    <div className={styles.toggleBtnWrap}>
      <label className={styles.toggleBtn}>
        <input
          type="checkbox"
          defaultChecked={isToggled}
          name={props.name}
          onClick={() => toggleHandler()}
        />
        <span></span>
        <div
          className={
            styles.toggleText + (isToggled ? ` ${styles.On}` : ` ${styles.Off}`)
          }
        >
          {isToggled ? "ON" : "OFF"}
        </div>
      </label>
      <strong>{label}</strong>
    </div>
  );
};

export default ToggleBtn;
