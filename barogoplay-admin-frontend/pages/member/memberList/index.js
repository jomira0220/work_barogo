import BasicTable from "@/components/TableBox/BasicTable";
import { getToken, serverSideGetApi } from "@/components/utils/serverSideGetApi";
import { queryString } from "@/components/utils/queryString";
import { FilterDataSet } from "@/components/utils/FilterDataSet";
import Layout from "@/components/Layout/Layout";


export default function MemberListPage(props) {
  const { memberListData } = props;

  console.log("memberListData", memberListData);


  return (
    <>
      <div className="basicBox maxWidth100">

        {/* 어떤 항목 필터의 테이블을 만들건지 */}
        <BasicTable
          downOnOff={true}
          data={memberListData}
          filterCategory="memberList"
          filterSearchSet={[
            "nickname",
            "userId",
            "riderCode",
            "userLevelGrade",
            "username"
          ]}
          filterListSet={
            [
              "brandCode", // 브랜드
              "status", // 라이더상태
              "joinDate", // 가입날짜
            ]
          }
          itemDetail={true}
          checkOnOff={true}
        />
      </div>
    </>
  );
}

MemberListPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = getToken(context);
  const queryUrl = queryString(FilterDataSet("memberList", context.query));
  const memberListRes = await serverSideGetApi(`/api/users?${queryUrl}`, accessToken, refreshToken, context);
  const memberListData = (await memberListRes.data) || [];

  return {
    props: {
      memberListData,
    },
  };
}
