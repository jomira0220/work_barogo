import { FormWarp, StyleBox, SentInput, SentDate, EditDataCheckBox } from '@/components/FormSet/FormSet'
import FileInput from '@/components/FileInput/FileInput';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import Image from 'next/image';
import { newAdvertisingHandler } from '@/components/utils/advertisingSet';
import Layout from '@/components/Layout/Layout';
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import ToggleBtn from '@/components/ToggleBtn/ToggleBtn';
import styles from './advertising.module.scss';
import SelectBox from '@/components/SelectBox/SelectBox';


export default function AdvertisingDetail(props) {
  const { advertisingDetailData, detailId } = props;
  console.log("배너 상세 데이터", advertisingDetailData)


  // 수정 전 원본 데이터 확인용
  const originalData = { ...advertisingDetailData };

  // 수정 데이터 확인용
  const [submitData, setSubmitData] = useState(null)

  const [startDate, setStartDate] = useState(new Date(advertisingDetailData.startDate));
  const [endDate, setEndDate] = useState(new Date(advertisingDetailData.endDate));

  // 시작일이 현재 시간보다 이전일 경우 경고노출
  const [dateAlert, setDateAlert] = useState(false);

  const [UploadImgUrl, setUploadImgUrl] = useState(advertisingDetailData.image);

  // 수정된 항목 확인용
  let valueCheck = {};
  Object.keys(originalData).map((item) => valueCheck[item] = false)
  const [changeValue, setChangeValue] = useState(valueCheck)

  // !모든 사용자에게 게시글 보이기 체크박스 체크시 다른 체크박스 해제 또는 브랜드 선택시 전체 체크박스 해제
  const CheckChange = (e) => {
    const brandCheck = document.querySelectorAll(`.${styles.brandCheck} input:not(#conditionBrand_0)`);
    if (e.target.value === "ALL" && e.target.checked) {
      brandCheck.forEach((item) => {
        item.checked = false;
      });
    } else if (e.target.value !== "ALL") {
      document.querySelector("#conditionBrand_0").checked = false;
    }
  }

  return (
    <div className='basicBox'>
      <h2>배너 상세</h2>
      <FormWarp>
        <StyleBox styletype="line">
          <h3>배너 타입</h3>
          {advertisingDetailData.type === "image" ? "이미지 배너" : "텍스트 배너"}
          <span className={styles.info}>* 배너 타입은 수정이 불가능합니다.</span>
        </StyleBox>

        <StyleBox styletype="line">
          <h3>활성상태</h3>
          <ToggleBtn name="advertisingStatus" defaultChecked={advertisingDetailData.enabled} />
        </StyleBox>

        <SentInput
          title="배너 제목"
          type="text"
          placeholder="배너 제목을 입력해주세요"
          name="advertisingTitle"
          defaultValue={advertisingDetailData.name}
          required
        />

        {advertisingDetailData.type == "image" && (
          <>
            <div>
              <h3>업로드된 배너 이미지</h3>
              <Image
                styles={{ height: "auto" }}
                src={
                  advertisingDetailData.image.includes("http")
                    ? advertisingDetailData.image
                    : "/images/logo_riderplay.png"
                }
                width={300}
                height={90}
                alt="배너 이미지"
                priority
              />
            </div>
            <FileInput
              title="배너 이미지"
              name="advertisingImage"
              accept=".png, .jpg, .jpeg"
              setUploadImgUrl={setUploadImgUrl}
              required
            />
          </>
        )}
        <SentInput
          title="배너 링크"
          type="url"
          placeholder="배너 링크를 연결해주세요. 예시) https://example.com"
          name="advertisingLink"
          pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
          defaultValue={advertisingDetailData.link}
          required
        />

        <div>
          <h3>배너 노출 기간</h3>
          {dateAlert &&
            <p style={{ color: "red", marginBottom: "15px", lineHeight: "1.2" }}>
              시작일은 현재 시간보다 이전일 수 없어 현재 시간으로 재설정되었습니다.
              <br /> 배너 노출 기간을 다시 설정해주세요.
            </p>
          }
          <StyleBox styletype="line">
            <SentDate
              minDate={new Date()}
              dateFormat='yyyy.MM.dd'
              selected={startDate}
              onChange={(date) => setStartDate(new Date(date))}
            // showTimeInput
            />
            ~
            <SentDate
              minDate={startDate}
              dateFormat='yyyy.MM.dd'
              selected={endDate}
              onChange={(date) => setEndDate(new Date(date))}
            // showTimeInput
            />
          </StyleBox>
        </div>
        {
          advertisingDetailData.targetCompany && (
            <div className={styles.brandCheck}>
              <h3>적용 브랜드</h3>
              <StyleBox styletype="checkBoxWarp">
                <label htmlFor='conditionBrand_0'>
                  <SentInput
                    type='checkbox'
                    id='conditionBrand_0'
                    name='conditionBrand'
                    value='ALL'
                    defaultChecked={advertisingDetailData.targetCompany.includes("ALL") ? true : false}
                    onChange={(e) => CheckChange(e)}
                  />
                  전체 <span>*비회원포함</span>
                </label>
                <label htmlFor='conditionBrand_1'>
                  <SentInput
                    type='checkbox'
                    id='conditionBrand_1'
                    name='conditionBrand'
                    value='BAROGO'
                    defaultChecked={advertisingDetailData.targetCompany.includes("BAROGO") ? true : false}
                    onChange={(e) => CheckChange(e)}
                  />
                  바로고
                </label>
                <label htmlFor='conditionBrand_2'>
                  <SentInput
                    type='checkbox'
                    id='conditionBrand_2'
                    name='conditionBrand'
                    value='DEALVER'
                    defaultChecked={advertisingDetailData.targetCompany.includes("DEALVER") ? true : false}
                    onChange={(e) => CheckChange(e)}
                  />
                  딜버
                </label>
                <label htmlFor='conditionBrand_3'>
                  <SentInput
                    type='checkbox'
                    id='conditionBrand_3'
                    name='conditionBrand'
                    value='MOALINE'
                    defaultChecked={advertisingDetailData.targetCompany.includes("MOALINE") ? true : false}
                    onChange={(e) => CheckChange(e)}
                  />
                  모아라인
                </label>
              </StyleBox>
            </div>
          )
        }


        {
          submitData && (
            <>
              <EditDataCheckBox
                originalData={originalData}
                submitData={submitData}
                changeValue={changeValue}
                type="advertising"
                id={detailId}
              />
            </>
          )
        }

        <Button type="submit" variantStyle="color" sizeStyle="sm"
          onClick={() =>
            newAdvertisingHandler(
              "edit", setDateAlert, setStartDate,
              startDate, setEndDate, endDate, originalData,
              changeValue, setChangeValue, setSubmitData, UploadImgUrl
            )
          }>수정하기</Button>

      </FormWarp>
    </div>
  )
}

AdvertisingDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};


export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const { detailId } = context.query;

  const advertisingRes = await serverSideGetApi(`/api/advertisements/${detailId}`, accessToken, refreshToken, context);
  const advertisingDetailData = await advertisingRes.data || null;

  return {
    props: {
      advertisingDetailData,
      detailId
    }
  }
}