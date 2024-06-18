
import { useState } from 'react'
import { getToken, serverSideGetApi } from '@/components/utils/serverSideGetApi'

import { FilterDataSet } from '@/components/utils/FilterDataSet'
import { queryString } from '@/components/utils/queryString'

import BasicTable from '@/components/TableBox/BasicTable'
import Layout from '@/components/Layout/Layout';
import SaveMemberListPop from '@/components/SaveMemberListPop'
import Button from '@/components/Button/Button'


export default function SaveMemberList(props) {
  const { saveMemberListData } = props;

  //! 신규 회원리스트 생성 팝업 노출용
  const [NewMemberListModal, setNewMemberListModal] = useState(false)

  return (
    <div className='basicBox'>
      <BasicTable
        filterCategory="saveMemberList"
        data={saveMemberListData}
        filterSearchSet={false}
        itemDetail={true}
        addButton={
          <Button variantStyle="color" sizeStyle="sm" onClick={() => setNewMemberListModal(true)}>회원리스트 신규 생성</Button>
        }
      />
      {NewMemberListModal && <SaveMemberListPop setNewMemberListModal={setNewMemberListModal} />}
    </div>
  )
}

SaveMemberList.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
}

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = getToken(context)
  const queryUrl = queryString(FilterDataSet("saveMemberList", context.query))
  const saveMemberListRes = await serverSideGetApi(`/api/userlists?${queryUrl}`, accessToken, refreshToken)
  const saveMemberListData = await saveMemberListRes.data || []

  return {
    props: {
      saveMemberListData
    }, // will be passed to the page component as props
  }
}