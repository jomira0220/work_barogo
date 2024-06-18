
import PageTop from '@/components/PageTop/PageTop';
import styles from './CustomerService.module.scss';
import LayoutBox from '@/components/LayoutBox/LayoutBox';
import CustomerServiceHeader from '@/components/CustomerServiceHeader';
import { LineBasicArrow } from '@/components/Icon/Icon';
import PaginationBox from "@/components/Pagination/PaginationBox";
import { getToken, serverSideGetApi } from '@/utils/serverSideGetApi';
import { useState } from 'react';
import Apis from '@/utils/Apis';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ReactQuillContainer from '@/components/ReactQuill/ReactQuillContainer';

export default function CustomerService(props) {
  const { isLogin, faqData } = props;
  const router = useRouter();

  console.log("고객센터", router, faqData)

  const qnaCategory = {
    all: "전체",
    community: "커뮤니티",
    activity: "활동기록",
    social: "소셜",
    gift: "선물",
    account: "계정/연동",
    etc: "기타"
  }

  const [detailContent, setDetailContent] = useState({})
  const showDetail = async (id) => {

    const dummyContent = { ...detailContent };
    const faqDetailRes = await Apis.get(`/api/boards/faq/posts/${id}`);
    console.log("faq 상세 내용 호출 api", faqDetailRes)

    if (faqDetailRes.status === 200 && faqDetailRes.data.status === "success") {
      const data = await faqDetailRes.data.data || [];
      dummyContent[id] = { content: data.content, status: !dummyContent[id] ? true : !dummyContent[id].status }
      setDetailContent(dummyContent);
    } else {
      alert("상세 내용을 불러오지 못했습니다. 사유 : " + faqDetailRes.data.message || "알수없는 오류")
    }

  }

  if (isLogin === "true")
    return (
      <>
        <PageTop backPath="/user/myPage">고객센터</PageTop>
        <CustomerServiceHeader />
        <div className={styles.faqBox}>
          <div className={styles.faqMenuBox}>
            <ul className={styles.qnaCategory}>
              {Object.keys(qnaCategory).map((item, index) => {
                const searchKeyword = router.query.searchKeyword || "all";
                return (
                  <li key={index} className={searchKeyword === item ? styles.active : ""}>
                    <Link href={router.pathname + (item !== "all" ? `?searchKeyword=${item}` : "")}>{qnaCategory[item]}</Link>
                  </li>
                )
              })}
            </ul>
          </div>
          {faqData && faqData.content.length > 0 ? (
            faqData.content.map((item, index) => {
              return (
                <ul key={index}>
                  <li onClick={() => showDetail(item.id)}>
                    <div className={styles.qBox}>
                      <div className={styles.textBox}>
                        <div className={styles.category}>{qnaCategory[item.postMeta.faqCategory]}</div>
                        <div className={styles.question}>
                          {item.title.includes("]") && <span className={styles.subCategory}>{item.title.split("]")[0] + "]"}</span>}
                          {item.title.includes("]") ? item.title.split("]")[1] : item.title}
                        </div>
                      </div>
                      <div className={styles.toggleBtn}>
                        <LineBasicArrow direction={detailContent[item.id] ? detailContent[item.id].status ? "up" : "down" : "down"} />
                      </div>
                    </div>
                    {detailContent && detailContent[item.id] && detailContent[item.id].status === true && (
                      <div className={styles.aBox}><ReactQuillContainer readOnly={true} content={detailContent[item.id].content} type="comment" /></div>
                    )}
                  </li>
                </ul>
              )
            })
          ) : <div className={styles.empty}>해당 카테고리에 대한 질문 및 답변이 없습니다.</div>
          }
        </div>
        {faqData && Number(faqData.totalElements) > 0 && (
          <PaginationBox
            activePage={Number(faqData.number) + 1}
            itemsCountPerPage={faqData.size}
            totalItemsCount={faqData.totalElements}
            pageRangeDisplayed={5}
          ></PaginationBox>
        )}
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

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = getToken(context);
  const searchKeyword = context.query.searchKeyword || "";
  const page = context.query.page || 0;
  const search = searchKeyword ? `&searchType=faqCategory&searchKeyword=${searchKeyword}` : "";
  const faqRes = await serverSideGetApi(`/api/boards/faq/posts?size=10&page=${page}&sort=createdDate,desc${search}`, accessToken, refreshToken, context);
  const faqData = await faqRes.data || [];
  return {
    props: {
      faqData
    }
  }
}