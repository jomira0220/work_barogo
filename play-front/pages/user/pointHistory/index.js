import LayoutBox from '@/components/LayoutBox/LayoutBox'
import PageTop from '@/components/PageTop/PageTop'
import DatePickerBox from '@/components/DatePickerBox/DatePickerBox'
import styles from './PointHistory.module.scss'
import { getToken, serverSideGetApi } from '@/utils/serverSideGetApi'
import { useRouter } from 'next/router'

export default function PointHistory(props) {
  let { historyData, date } = props
  const router = useRouter()

  console.log('포인트 적립 내역 데이터', historyData)

  //! 날짜 변경시 쿼리 변경 처리
  const ChangeDate = (date) => {
    const newDate = date.toISOString().split('T')[0]
    router.push(`/user/pointHistory?date=${newDate}`)
  }
  const totalPoint = historyData.reduce((acc, cur) => acc + cur.point, 0) // 날짜별 경험치 총합

  return (
    <>
      <PageTop backPath="/user/myPage">경험치 획득 내역</PageTop>
      <div className={styles.pointWrap}>
        <div className={styles.dateBox}>
          <DatePickerBox onChange={(date) => ChangeDate(date)} selected={new Date(date)} />
        </div>

        {historyData && historyData.length > 0 ? (
          <>
            <div className={styles.tableTop}>
              <span>항목</span>
              <span>세부 내용</span>
              <span>경험치</span>
            </div>
            <ul className={styles.tableList}>
              {historyData.map((item, index) => {
                return (
                  <li key={index}>
                    <span><span className='blind'>항목</span>{item.typeName}</span>
                    <span><span className='blind'>세부내용</span>{item.detail}</span>
                    <span><span className='blind'>경험치</span>{item.point.toLocaleString("ko-KR")}Exp</span>
                  </li>
                )
              })}
            </ul>
            <div className={styles.totalPoint}>총 획득 경험치 : <b>{(totalPoint).toLocaleString("ko-KR")}Exp</b></div>
          </>
        ) : (
          <div className={styles.noData}>획득한 경험치가 없습니다.</div>
        )
        }
      </div>
    </>
  )
}

PointHistory.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>
}


export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context)
  let { date } = context.query
  date = date || new Date().toISOString().split('T')[0]  // 링크로 들어온 경우 date가 없을 수 있음 그럼 어제 날짜로
  const historyRes = await serverSideGetApi(`/api/points/${date}`, accessToken, refreshToken, context)
  const historyData = await historyRes.data || [];
  return {
    props: { historyData, date },
  }
}