import PageTop from "@/components/PageTop/PageTop";
import { useRouter } from "next/router";
import styles from "./certification.module.scss";
import LayoutBox from "@/components/LayoutBox/LayoutBox";
import Button from "@/components/Button/Button";
import { CheckBgIcon } from "@/components/Icon/Icon";
import Image from "next/image";

export default function CertificationSuccess() {
  const router = useRouter();
  const { brandCode } = router.query;

  return (
    <>
      <div className={styles.top}><PageTop>본인 인증 성공</PageTop></div>
      <div
        id={styles.brandCode}
        className={styles.certificationWarp}
        data-brand={brandCode}
      >
        <div
          className={styles.inner + " " + styles.playSuccess}
          data-brand={brandCode}
        >
          <div className={styles.logoBox}>
            <div className={styles.brandLogo}>
              {// !브랜드 로고 이미지 셋팅
                brandCode === "BAROGO" ? <Image src="/images/logo/logo_bk.png" alt="바로고" width="155" height="23" /> :
                  brandCode === "MOALINE" ? <Image src="/images/logo/logo_moaline.png" alt="모아라인" width="100" height="23" /> :
                    brandCode === "DEALVER" ? <Image src="/images/logo/logo_dealver.png" alt="딜버" width="126" height="20" /> : ""
              }
            </div>
            <div className={styles.line}>
              <span></span>
            </div>
            <h1>
              <Image src="/images/logo/logo_riderplay.png" alt="라이더플레이" width="133" height="23" />
            </h1>
          </div>
          <h2>
            라이더 계정이 라이더플레이에
            <br />
            연동되었습니다.
          </h2>
          <p>
            매일 오후 2시, 전날 0시~24시까지<br />
            배달수행 기록을 플레이에 저장합니다
          </p>
          <div className={styles.bottomArea}>
            <Button
              variantStyle="color"
              sizeStyle="lg"
              onClick={() => location.href = "/user/myPage?certification=success"}
            >
              마이페이지로 이동
            </Button>
          </div>
        </div>

      </div>

    </>
  );
}

CertificationSuccess.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};
