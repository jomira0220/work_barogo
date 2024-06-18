
import PageTop from '@/components/PageTop/PageTop';
import styles from './CustomerService.module.scss';
import LayoutBox from '@/components/LayoutBox/LayoutBox';
import { useRouter } from 'next/router';
import ReactQuillContainer from '@/components/ReactQuill/ReactQuillContainer';
import { useState } from 'react';
import Button from '@/components/Button/Button';
import Apis from '@/utils/Apis';


export default function CustomerService(props) {
  const { isLogin, profileData } = props;
  const router = useRouter();

  const qnaSubmit = async () => {

    const selectBox = document.querySelector(`.${styles.selectBox}`).value;
    const title = document.getElementById('title').value;
    const content = document.querySelector('.ql-editor').innerHTML;
    if (selectBox === "none") {
      alert("문의항목을 선택해주세요.");
      return;
    } else if (title === "") {
      alert("제목을 입력해주세요.");
      return;
    } else if (content === "<p><br></p>") {
      alert("내용을 입력해주세요.");
      return;
    }

    const data = {
      title: title,
      content: content,
      postMeta: {
        qnaCategory: selectBox
      }
    }

    const qnasPost = await Apis.post(`/api/users/me/qnas`, data);
    console.log("QnA 등록 api : ", qnasPost, "등록할 Data : ", data);
    if (qnasPost.status === 200 && qnasPost.data.status === "success") {
      alert("문의가 등록되었습니다.");
      router.push("/customerService/list");
    } else {
      alert("문의 등록에 실패했습니다. 사유 : " + qnasPost.data.message || "알수없는 오류");
    }

  }

  if (isLogin === "true")
    return (
      <>
        <PageTop backPath="/customerService/list">문의 작성</PageTop>
        <div className={styles.qnaBox}>
          <select className={styles.selectBox} name="qnaCategory" defaultValue={"none"}>
            <option value="none" disabled>문의항목을 선택해주세요.</option>
            <option value="불편사항개선">불편 사항 개선 문의</option>
            <option value="이벤트문의">이벤트 문의</option>
            <option value="오류문의">오류 문의</option>
            <option value="이용문의">이용 문의</option>
            <option value="기타문의">기타 문의</option>
          </select>
          <input
            id="title"
            className={styles.writeTitle}
            type="text"
            placeholder="제목을 입력하세요. 30자이내"
            maxLength={30}
            autoFocus
          />
          <ReactQuillContainer className={styles.faqQuill} />
          <Button variantStyle="color" sizeStyle="lg" onClick={() => qnaSubmit()}>문의하기</Button>
        </div>
      </>
    );
};

CustomerService.getLayout = function getLayout(page) {
  return (
    <LayoutBox>
      {page}
    </LayoutBox>
  );
};

