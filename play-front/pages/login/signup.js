import Image from 'next/image'
import PageTop from "@/components/PageTop/PageTop";
import LayoutBox from "@/components/LayoutBox/LayoutBox";
import Button from "@/components/Button/Button";
import styles from './signup.module.scss'
import Modal from '@/components/Modal/Modal'
import { useState } from 'react';
import { LineBasicArrow, CheckBoxIcon } from '@/components/Icon/Icon';
import { termDetail, termKo } from '@/utils/termsOfUseDetail';

export default function SignUpPage() {

  const [agree, setAgree] = useState({ onoff: false, type: "termsService" })
  const [checkArr, setCheckArr] = useState({ checkAll: false, termsService: false, termsPrivacy: false, termsProvision: false, termsMarketing: false })
  const retURL = process.env.NEXT_PUBLIC_DOMAIN_URL + "/login/join"
  const [greetings, setGreetings] = useState(true)


  //! 약관동의 체크한 값들 저장
  const CheckHandler = (e, checkArr, setCheckArr) => {
    const dummy = { ...checkArr }
    if (e.target.name === "checkAll") {
      dummy.checkAll = !dummy.checkAll
      dummy.termsService = dummy.checkAll
      dummy.termsPrivacy = dummy.checkAll
      dummy.termsProvision = dummy.checkAll
      dummy.termsMarketing = dummy.checkAll
    } else {
      dummy[e.target.name] = !dummy[e.target.name]
    }
    dummy.checkAll = dummy.termsService && dummy.termsPrivacy && dummy.termsProvision && dummy.termsMarketing
    setCheckArr(dummy)
  }

  // ! 다음 버튼 클릭시 약관동의 여부 체크
  const goCert = (e, checkArr) => {
    if (!(checkArr.termsService && checkArr.termsPrivacy && checkArr.termsProvision)) {
      e.preventDefault();
      if (typeof window !== 'undefined') alert('필수 약관에 동의해주세요')
      return
    }
  }
  //! 약관 항목
  const AgreeItem = ({ title, checkName }) => {
    return (
      <li>
        <label htmlFor={checkName}>
          <CheckBoxIcon onoff={String(checkArr[checkName])} />
          <input
            type="checkbox"
            className="blind"
            id={checkName}
            defaultChecked={checkArr[checkName]}
            name={checkName}
            onChange={(e) => CheckHandler(e, checkArr, setCheckArr)}
          />
          {title}
        </label>
        <button className={styles.linkArrow} onClick={() => setAgree({ onoff: true, type: checkName })}>
          <span className='blind'>자세히보기</span><LineBasicArrow color="var(--gray-color-1)" />
        </button>
      </li>
    )
  }

  // ! 약관 항목 상세
  const TermsDetail = ({ agreeType, type, termName }) => {
    if (agreeType === type)
      return (
        <>
          <h3>{termKo[termName]}</h3>
          {termDetail[termName]}
        </>
      )
  }

  return (
    <div className={styles.memberAgreeWrap}>
      <PageTop backPath={`${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`}>
        약관동의
      </PageTop>
      {greetings && (
        <div className={styles.greetings}>
          <div className={styles.greetingsInner}>
            <h1>
              <Image src="/images/logo/logo_riderplay.png" width="200" height="35" alt="라이더플레이" priority={true} />
            </h1>
            <h3>환영합니다!</h3>
            <p>
              라이더플레이는<br />
              모든 배달 라이더가 사용할 수 있는<br />
              오픈 커뮤니티입니다.<br />
              <br />
              라이더플레이 계정은<br />
              <b>본인인증 후 1개만</b> 만들 수 있고<br />
              사용하시는 라이더앱 계정과<br />
              전화번호가 달라도 연동할 수 있습니다.
            </p>
            <span>*연동 가능한 라이더앱 : 바로고, 모아라인, 딜버</span>
            <Button onClick={() => setGreetings(false)} sizeStyle="lg" variantStyle="color">다음</Button>
          </div>
        </div>
      )}

      <div className={styles.memberAgree}>
        <h1>
          <Image src="/images/logo/logo_riderplay.png" width="200" height="35" alt="라이더플레이" priority={true} />
        </h1>
        <p>
          <b>환영합니다!</b>
          <br />바로고 플레이에 가입하시려면 <br />약관에 동의해 주세요.
        </p>

        <ul className={styles.agreeList}>
          <li>
            <label htmlFor="checkAll">
              <CheckBoxIcon onoff={String(checkArr.checkAll)} />
              <input type="checkbox" className="blind" id="checkAll" defaultChecked={checkArr.checkAll} name="checkAll" onChange={(e) => CheckHandler(e, checkArr, setCheckArr)} />
              약관 전체 동의
            </label>
          </li>
          <AgreeItem title={termKo.terms_of_service} checkName="termsService" />
          <AgreeItem title={termKo.terms_of_use} checkName="termsPrivacy" />
          <AgreeItem title={termKo.terms_of_provision} checkName="termsProvision" />
          <AgreeItem title={termKo.terms_of_marketing} checkName="termsMarketing" />
        </ul>
        {
          agree.onoff && (
            <Modal id={styles.detailPopup} type="bottom" closePortal={() => setAgree(false)}>
              <TermsDetail agreeType={agree.type} type="termsService" termName="terms_of_service" />
              <TermsDetail agreeType={agree.type} type="termsPrivacy" termName="terms_of_use" />
              <TermsDetail agreeType={agree.type} type="termsProvision" termName="terms_of_provision" />
              <TermsDetail agreeType={agree.type} type="termsMarketing" termName="terms_of_marketing" />
            </Modal>
          )
        }

        <form method="post" action={`${process.env.NEXT_PUBLIC_AUTH_URL}/cert`} >
          <input type="hidden" id="termsProvision" name="termsProvision" value={String(checkArr.termsProvision)} />
          <input type="hidden" id="termsMarketing" name="termsMarketing" value={String(checkArr.termsMarketing)} />
          <input type="hidden" id="retURL" name="retURL" value={retURL} />
          <Button type="submit" id="memberAgreeNext" onClick={(e) => goCert(e, checkArr)} sizeStyle="lg" variantStyle="color">
            다음
          </Button>
        </form>

      </div>
    </div>
  )
}

SignUpPage.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
}; 