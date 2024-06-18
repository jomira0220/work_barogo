import Button from '@/components/Button/Button'
import BasicTable from '@/components/TableBox/BasicTable'
import Layout from '@/components/Layout/Layout'
import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'
import Apis from '@/components/utils/Apis'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function BlockManagementPage(props) {
  const { blockMemberData: propsBlockData, queryUrl } = props;

  const [blockMemberData, setBlockMemberData] = useState(propsBlockData)
  console.log(blockMemberData, 'blockMemberData')

  const router = useRouter()

  const UnblockHandler = async (e) => {
    const communityBlockList = e.target.dataset.communityblocklist;
    const nicknameBlockList = e.target.dataset.nicknameblocklist;
    console.log(communityBlockList, nicknameBlockList)
    if (communityBlockList === "[]" && nicknameBlockList === "[]") {
      alert('선택된 ID가 없습니다.')
      return
    } else {
      const userIdsQuery = (listValue) => {
        if (listValue.includes(',')) {
          return listValue.split(',').join('&userIds=')
        } else {
          return listValue
        }
      }

      const communityBlockQuery = userIdsQuery(communityBlockList)
      const nicknameBlockQuery = userIdsQuery(nicknameBlockList)

      const idList = (
        (communityBlockList === "[]" ? "" : `커뮤니티 차단ID : ${communityBlockQuery}`) +
        (nicknameBlockList === "[]" ? "" : communityBlockList === "[]" ? `닉네임 차단ID : ${nicknameBlockQuery}` : `\n닉네임 차단ID : ${nicknameBlockQuery}`)
      ).replace(/[\[\]']+/g, '')
      const confirmResult = confirm(`${idList}\n차단해제 하시겠습니까?`)
      console.log(confirmResult)


      const BlockResCheck = async (res, type) => {
        if (res.status === 200 || res.data.status === 'success') {
          // alert('차단해제가 완료되었습니다.')
        } else {
          alert(type + '차단해제에 실패하였습니다.')
        }
      }



      if (confirmResult) {
        if (communityBlockQuery !== "[]") {
          const Co_unblockRes = await Apis.post(`/api/users/unblock?userIds=${communityBlockQuery}&blockedType=COMMUNITY`)
          BlockResCheck(Co_unblockRes, '커뮤니티')
        }
        if (nicknameBlockQuery !== "[]") {
          const Na_unblockRes = await Apis.post(`/api/users/unblock?userIds=${nicknameBlockQuery}&blockedType=NICKNAME`)
          BlockResCheck(Na_unblockRes, '닉네임')
        }
      }


      const memberListRefresh = await Apis.get(`/api/users/blocked?${queryUrl}`)
      setBlockMemberData(memberListRefresh.data.data)
      console.log(memberListRefresh.data.data, 'memberListRefresh.data.data')


    }
  }


  return (
    <div className='basicBox maxWidth100'>
      <h3>차단된 회원 리스트</h3>
      <BasicTable
        downOnOff={true}
        filterCategory="blockMemberList"
        data={blockMemberData}
        filterSearchSet={[
          "all",
          "brandCode",
          "nickname",
          "blockCode",
          "blockCount",
          "handlers",
        ]}
        itemDetail={true}
        checkOnOff={true}
        addButton={
          <Button variantStyle="color" sizeStyle="sm" className="listCheckBtn" onClick={(e) => UnblockHandler(e)}>차단해제</Button>
        }
      />
    </div>
  )
}

BlockManagementPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}


export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = await getToken(context);
  const query = context.query;
  const queryUrl = queryString(FilterDataSet("blockMemberList", query));
  const blockMemberRes = await serverSideGetApi(
    `/api/users/blocked?${queryUrl}`,
    accessToken,
    refreshToken,
    context
  );
  const blockMemberData = await blockMemberRes.data || [];

  return {
    props: {
      blockMemberData,
      queryUrl
    },
  };
}
