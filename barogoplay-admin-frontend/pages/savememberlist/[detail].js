import styles from './savememberlist.module.scss'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import Layout from '@/components/Layout/Layout';
// import { useState } from 'react';
import BasicTable from '@/components/TableBox/BasicTable'
// import { FilterDataSet } from '@/components/utils/FilterDataSet'
// import { queryString } from '@/components/utils/queryString'
import Button from '@/components/Button/Button'
import { useRouter } from 'next/router'
import { SaveMemberListDelete } from "@/components/TableBox/tableControl";
// import { stringKrChange } from '@/components/utils/stringKrChange';
import Apis from '@/components/utils/Apis'


export default function SaveMemberListDetail(props) {
  const { detailId, userListDetailData } = props;
  const router = useRouter()
  const titleSet = {
    name: "제목",
    memo: "메모",
    createdDate: "저장된 날짜",
    count: "리스트 인원수", // 리스트 인원수
    userList: "리스트 확인", // 리스트 계정 코드 리스트
  }

  //!선택한 회원 리스트에서 삭제하기
  const DelListCheck = async (e) => {
    const idValue = e.target.dataset.checklist
    if (idValue === "") return alert("선택된 회원이 없습니다.")
    const IdList = idValue.split(",").join("&userIdList=");

    const delAlert = confirm("선택한 회원을 삭제하시겠습니까?")
    if (!delAlert) return

    const userDelRes = await Apis.delete(`/api/userlists/${detailId}/users?userIdList=${IdList}`)
    console.log(userDelRes)

    if (userDelRes.status === 200 && userDelRes.data.status === "success") {
      alert("선택한 회원이 삭제되었습니다.")
      router.reload()
    } else {
      alert("선택한 회원 삭제에 실패하였습니다.")
    }
  }



  return (
    <div className='basicBox'>
      <h2>저장된 회원 리스트 상세</h2>
      <div className={styles.detailWarp}>
        {
          Object.keys(titleSet).map((item, index) => {
            const krTitle = titleSet[item];
            if (krTitle === "리스트 확인") {
              return (
                <div key={index} className={styles.detailItem}>
                  <span className={styles.title}>{krTitle}</span>

                  <div className={styles.listCheckTable}>
                    <h5>저장된 회원 목록</h5>
                    <BasicTable
                      data={userListDetailData.userList}
                      filterCategory="saveMemberListDetail" // !나중에 이부분 수정해야함
                      checkOnOff={true}
                    />

                    <div className='checkListBox'></div>

                    {/* 나중에 밑에  memberList_TableTop 이부분 앞에 필터카테고리 맞춰서 수정하기 */}
                    <div className={"saveMemberListDetail_TableTop" + " " + styles.removeMemberBtn}>
                      <Button
                        className="listCheckBtn"
                        variantStyle="color"
                        sizeStyle="sm"
                        onClick={(e) => DelListCheck(e)}
                      >
                        선택한 회원 삭제
                      </Button>
                    </div>
                  </div>
                  <div className={styles.buttonWrap}>
                    <Button variantStyle="darkgray" sizeStyle="sm" onClick={() => router.push('/savememberlist')}>목록보기</Button>
                    <Button variantStyle="color" sizeStyle="sm" onClick={() => SaveMemberListDelete(detailId, router)}>리스트 삭제</Button>
                  </div>
                </div>
              )
            } else if (krTitle === "검색조건") {
              // return (
              //   <div key={index} className={styles.detailItem}>
              //     <span className={styles.title}>{krTitle}</span>
              //     <ul>
              //       {
              //         Object.keys(data.searchCondition).filter(item => !item.includes("Date") && !item.includes("Count") && !item.includes("Point")).map((keyName, index2) => {
              //           const krKeyName = searchItemSet[keyName]
              //           const conditionValue = data.searchCondition[keyName]
              //           return (
              //             <li key={index2}>
              //               <span className={styles.title}>{krKeyName}</span>
              //               {
              //                 krKeyName === "브랜드"
              //                   ? conditionValue.join(", ")
              //                   : conditionValue
              //               }
              //             </li>
              //           )
              //         })
              //       }

              //       {
              //         Object.keys(setValueCondition).filter(
              //           item => setValueCondition[item].length > 0 && !(item.includes("Count") || item.includes("Point"))
              //         ).map((item, index2) => {
              //           const krKeyName = searchItemSet[item]
              //           const conditionValue = setValueCondition[item]
              //           console.log("conditionValue", conditionValue)
              //           return (
              //             <li key={index2}>
              //               <span className={styles.title}>{krKeyName}</span>
              //               {conditionValue.join(" ~ ")}
              //             </li>
              //           )
              //         })
              //       }
              //       <li className={styles.numberCondition}>
              //         <span className={styles.title}>숫자 범위 필터</span>
              //         {
              //           Object.keys(setValueCondition).filter(
              //             item => setValueCondition[item].length > 0 && (item.includes("Count") || item.includes("Point"))
              //           ).length > 0 ? (
              //             <ul>
              //               {
              //                 Object.keys(setValueCondition).filter(
              //                   item => setValueCondition[item].length > 0 && (item.includes("Count") || item.includes("Point"))
              //                 ).map((item, index2) => {
              //                   const krKeyName = searchItemSet[item]
              //                   const conditionValue = setValueCondition[item]
              //                   conditionValue.map((item, index) => { return (conditionValue[index] = item.toLocaleString("ko-kr") + "P") }) // 숫자에 콤마 추가
              //                   // console.log("conditionValue", conditionValue)
              //                   return (
              //                     <li key={index2}>
              //                       <span className={styles.title}>{krKeyName}</span>
              //                       {conditionValue.join(" ~ ")}
              //                     </li>
              //                   )
              //                 })
              //               }
              //             </ul>
              //           ) : "없음"
              //         }
              //       </li>
              //     </ul>

              //   </div>
              // )
            } else {
              return (
                <div key={index} className={styles.detailItem}>
                  <span className={styles.title}>{krTitle}</span>
                  <span>{typeof userListDetailData[item] === "number" ? (userListDetailData[item]).toLocaleString("ko-kr") : userListDetailData[item]}</span>
                </div>
              )
            }
          })
        }
      </div>
    </div >
  )

}

SaveMemberListDetail.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = getToken(context)
  const { detailId } = context.query
  const userListDetailRes = await serverSideGetApi(`/api/userlists/${detailId}`, accessToken, refreshToken, context)
  const userListDetailData = await userListDetailRes.data || []

  return {
    props: {
      detailId,
      userListDetailData
    }, // will be passed to the page component as props
  }
}

