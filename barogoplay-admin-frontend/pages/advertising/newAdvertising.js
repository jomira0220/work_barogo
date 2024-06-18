import { FormWarp, StyleBox, SentInput, SentDate } from '@/components/FormSet/FormSet'
import FileInput from '@/components/FileInput/FileInput';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import { newAdvertisingHandler } from '@/components/utils/advertisingSet';
import Layout from '@/components/Layout/Layout';
import ToggleBtn from '@/components/ToggleBtn/ToggleBtn';
import styles from './advertising.module.scss';
import SelectBox from '@/components/SelectBox/SelectBox';

export default function NewAdvertising() {

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState();

  // 시작일이 현재 시간보다 이전일 경우 경고노출
  const [dateAlert, setDateAlert] = useState(false);
  const [UploadImgUrl, setUploadImgUrl] = useState("");

  const [submitData, setSubmitData] = useState({});

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

  //! 배너 타입 선택시 해당 배너 타입으로 변경
  const [BannerType, setBannerType] = useState("image");
  const bannerTypeChange = (type) => {
    setBannerType(type)
  }

  return (
    <div className='basicBox'>
      <h2>신규 배너</h2>
      <FormWarp method="POST">

        <StyleBox styletype="line">
          <h3>배너 타입</h3>
          <SelectBox
            className={styles.bannerType}
            options={[
              { label: '이미지 배너', value: 'image' },
              { label: '텍스트 배너', value: 'text' },
            ]}
            defaultValue={{ label: '이미지 배너', value: 'image' }}
            onChange={(e) => bannerTypeChange(e.value)}
            name="bannerType"
          />
        </StyleBox>

        <StyleBox styletype="line">
          <h3>활성 상태</h3>
          <ToggleBtn name="advertisingStatus" />
        </StyleBox>

        <SentInput
          title="배너 제목"
          type="text"
          placeholder="배너 제목을 입력해주세요"
          name="advertisingTitle"
          required
        />

        {BannerType == "image" && (
          <FileInput
            name="advertisingImage"
            title="배너 이미지"
            inputInfo="*사용자에게 노출되는 항목입니다."
            accept=".png, .jpg, .jpeg"
            setUploadImgUrl={setUploadImgUrl}
          />)}

        <SentInput
          title="배너 링크"
          type="url"
          placeholder="배너 링크를 연결해주세요. 예시) https://example.com"
          name="advertisingLink"
          pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
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
              selected={startDate > endDate ? startDate : endDate}
              onChange={(date) => setEndDate(new Date(date))}
            // showTimeInput
            />
          </StyleBox>
        </div>

        <div className={styles.brandCheck}>
          <h3>적용 브랜드</h3>
          <StyleBox styletype="checkBoxWarp">
            <label htmlFor='conditionBrand_0'>
              <SentInput
                type='checkbox'
                id='conditionBrand_0'
                name='conditionBrand'
                value='ALL'
                defaultChecked={true}
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
                defaultChecked={false}
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
                defaultChecked={false}
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
                defaultChecked={false}
                onChange={(e) => CheckChange(e)}
              />
              모아라인
            </label>

          </StyleBox>
        </div>

        <Button
          type="submit"
          variantStyle="color"
          sizeStyle="md"
          onClick={() =>
            newAdvertisingHandler("new", setDateAlert, setStartDate, startDate, setEndDate, endDate, "", "", "", setSubmitData, UploadImgUrl)
          }
        >작성 완료</Button>

      </FormWarp>
    </div>
  )
}

NewAdvertising.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};