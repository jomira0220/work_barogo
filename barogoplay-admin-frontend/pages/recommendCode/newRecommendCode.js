import Layout from '@/components/Layout/Layout'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { queryString } from '@/components/utils/queryString'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import Apis from '@/components/utils/Apis'
import Button from '@/components/Button/Button'
import styles from './RecommendCode.module.scss'
import {
  FormWarp,
  SentContent,
  SentDate,
  SentInput,
  StyleBox,
} from "@/components/FormSet/FormSet";
import { useState } from 'react';
import { TimeKoChange } from '@/components/utils/TimeKoChange'



export default function NewRecommendCode(props) {

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7)));

  //! 추천 코드 등록
  const NewRecommendCode = async () => {
    const data = {
      recommendCodeName: document.querySelector("[name='NewRecommendCodeName']").value,
      recommendCode: document.querySelector("[name='NewRecommendCode']").value,
      recommendCodeDescription: document.querySelector("[name='NewRecommendCodeDescription']").value,
      startDate: TimeKoChange(document.querySelector("[name='NewRecommendCodeStartDate']").value),
      endDate: TimeKoChange(document.querySelector("[name='NewRecommendCodeEndDate']").value),
    }
    console.log("추천 코드 등록", data)

    // const RecommendRes = await Apis.post("/api/recommendCode", data)
    // if (RecommendRes.status === 200) {
    //   alert("성공적으로 처리되었습니다.")
    // } else {
    //   alert("처리중 오류가 발생하였습니다.")
    // }
  }

  return (
    <div className="basicBox">
      <h2>추천 코드 신규 등록</h2>
      <FormWarp>
        <SentInput
          title="추천 코드 명"
          type="text"
          placeholder="추천 코드명을 입력해주세요"
          name="NewRecommendCodeName"
          inputInfo="* 유저에게 노출됩니다."
        />

        <SentInput
          title="생성할 추천 코드"
          type="text"
          placeholder="유저에게 입력 받을 추천 코드를 입력해주세요."
          name="NewRecommendCode"
          inputInfo="* 유저에게 노출됩니다."
        />

        <SentContent
          title="추천 코드 설명"
          limitCount={50}
          name="NewRecommendCodeDescription"
          inputInfo="* 관리자 확인용 설명입니다. 유저에게 노출되지 않습니다."
        />

        <div>
          <h3>추천 코드 사용 기간</h3>
          <StyleBox styletype="line">
            <SentDate
              minDate={new Date()}
              dateFormat="yyyy.MM.dd HH:mm"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              name="NewRecommendCodeStartDate"
              showTimeInput
            />
            ~
            <SentDate
              minDate={startDate}
              dateFormat="yyyy.MM.dd HH:mm"
              selected={startDate >= endDate ? startDate : endDate}
              onChange={(date) => setEndDate(date)}
              name="NewRecommendCodeEndDate"
              showTimeInput
            />
          </StyleBox>
        </div>

        <div className={styles.buttonWrap}>
          <Button variantStyle="color" sizeStyle="sm" onClick={() => NewRecommendCode()}>등록하기</Button>
        </div>

      </FormWarp>

    </div>
  )
}

NewRecommendCode.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};