import Layout from '@/components/Layout/Layout'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import { queryString } from '@/components/utils/queryString'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import Button from '@/components/Button/Button'
import { useState } from 'react'
import styles from './RecommendCode.module.scss'
import {
  FormWarp,
  SentContent,
  SentDate,
  SentInput,
  StyleBox,
} from "@/components/FormSet/FormSet";
import Apis from '@/components/utils/Apis'
import { TimeKoChange } from '@/components/utils/TimeKoChange'

export default function RecommendCodeDetail(props) {

  const { recommendCodeDetailData } = props;
  console.log("추천 코드 상세 데이터", recommendCodeDetailData)

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 7))); // 기본 오늘로부터 7일까지

  // 추천 코드 수정, 삭제 핸들러
  const recommendHandler = async (type) => {
    const data = {
      recommendCodeName: document.querySelector("[name='RecommendCodeName']").value,
      recommendCode: document.querySelector("[name='RecommendCode']").value,
      recommendCodeDescription: document.querySelector("[name='RecommendCodeDescription']").value,
      startDate: TimeKoChange(document.querySelector("[name='recommendCodeStartDate']").value),
      endDate: TimeKoChange(document.querySelector("[name='recommendCodeEndDate']").value),
    }

    // const RecommendRes = type === "edit" ? await Apis.put("/api/recommendCode", data) : await Apis.delete("/api/recommendCode", data)
    // if (RecommendRes.status === 200) {
    //   alert("성공적으로 처리되었습니다.")
    // } else {
    //   alert("처리중 오류가 발생하였습니다.")
    // }

    if (type === "edit") {
      console.log("추천 코드 수정", data)
    } else if (type === "delete") {
      console.log("추천 코드 삭제", data)
    }
  }

  return (
    <div className='basicBox'>
      <h2>추천 코드 상세</h2>
      <FormWarp>
        <SentInput
          title="추천 코드 명"
          type="text"
          placeholder="추천 코드명을 입력해주세요"
          name="RecommendCodeName"
          inputInfo="* 유저에게 노출됩니다."
          defaultValue="추천 코드명이 여기에 노출됩니다. 나중에 변수로 변경해주기"
        />

        <SentInput
          title="생성할 추천 코드"
          type="text"
          placeholder="유저에게 입력 받을 추천 코드를 입력해주세요."
          name="RecommendCode"
          inputInfo="* 유저에게 노출됩니다."
          defaultValue="sdjfksdfjslkfjslfd"
        />

        <SentContent
          title="추천 코드 설명"
          limitCount={50}
          name="RecommendCodeDescription"
          inputInfo="* 관리자 확인용 설명입니다. 유저에게 노출되지 않습니다."
          defaultValue="추천 코드 설명이 들어갑니다. 나중에 설명변수 넣어주기"
        />

        <div>
          <h3>추천 코드 사용 기간</h3>
          <StyleBox styletype="line">
            <SentDate
              minDate={new Date()}
              dateFormat="yyyy.MM.dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              name="recommendCodeStartDate"
            // showTimeInput
            />
            ~
            <SentDate
              minDate={startDate}
              dateFormat="yyyy.MM.dd"
              selected={startDate >= endDate ? startDate : endDate}
              onChange={(date) => setEndDate(date)}
              name="recommendCodeEndDate"
            // showTimeInput
            />
          </StyleBox>
        </div>

        <div className={styles.buttonWrap}>
          <Button variantStyle="color" sizeStyle="sm" onClick={() => recommendHandler("edit")}>수정하기</Button>
          <Button variantStyle="darkgray" sizeStyle="sm" onClick={() => recommendHandler("delete")}>삭제하기</Button>
        </div>

      </FormWarp>

    </div>
  )
}

RecommendCodeDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { detailId } = context.query
  const { accessToken, refreshToken } = getToken(context)
  const recommendCodeDetailRes = await serverSideGetApi(`/api/recommendCode/${detailId}`, accessToken, refreshToken, context)
  const recommendCodeDetailData = recommendCodeDetailRes ? recommendCodeDetailRes.data : []

  return {
    props: {
      recommendCodeDetailData
    }
  }
}