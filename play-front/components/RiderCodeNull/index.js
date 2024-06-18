import Button from "@/components/Button/Button";
import { useRouter } from "next/router";
import styles from "./RiderCodeNull.module.scss";

export default function RiderCodeNull(props) {
  const { page } = props;
  const router = useRouter();
  return (
    <div className={styles.riderCodeNull + (page === "mypage" ? ` ${styles.mypage}` : "")}>
      <p>
        {page === "mypage" ? "" : (<>라이더 계정을 연동한 후<br /> 이용할 수 있는 서비스입니다.</>)}
      </p>
      <Button
        sizeStyle="md"
        variantStyle="color"
        onClick={() => router.push("/user/riderPhoneNumber")}
      >
        라이더 계정 연동하기
      </Button>
    </div>
  )
}