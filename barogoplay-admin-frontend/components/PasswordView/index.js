
import { PasswordShowHideIcon } from "@/components/Icon/Icon";
import { useState } from 'react'
import styles from './PasswordView.module.scss'

export default function PasswordView(props) {
  const { placeholder, name } = props;
  const [passwordShow, setPasswordShow] = useState(false);

  const changeSetPasswordShow = () => {
    setPasswordShow(!passwordShow);
  }

  return (
    <div className={styles.passwordView}>
      <input
        className={styles.passwordInput}
        type={passwordShow ? "text" : "password"}
        placeholder={placeholder ? placeholder : "비밀번호를 입력해주세요."}
        name={name ? name : "password"} />
      <div className={styles.eyeIcon}
        onClick={() => changeSetPasswordShow()}>
        <PasswordShowHideIcon onoff={passwordShow ? "on" : "off"} />
      </div>
    </div>
  )
}