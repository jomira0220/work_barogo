import PageTop from '@/components/PageTop/PageTop';
import Button from '@/components/Button/Button'
import styles from './deliveryList.module.scss'
import LayoutBox from '@/components/LayoutBox/LayoutBox';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { getToken, serverSideGetApi } from '@/utils/serverSideGetApi';
import Apis from '@/utils/Apis';
import { loginCheck } from '@/utils/loginCheck';

export default function DeliveryList(props) {

  const router = useRouter();
  const { isLogin, deliveryListData } = props;

  loginCheck(isLogin)

  const [deliveryList, deliveryListSet] = useState(deliveryListData)
  const [choiceActive, choiceActiveSet] = useState(false)
  const dummyData = [...deliveryList]

  const DefaultChoice = async (e) => {
    if (e.target.innerHTML === '기본 배송지 선택하기') {
      e.target.innerHTML = '기본 배송지 선택 완료'
      e.target.parentNode.classList.add(styles.choiceActive)
      choiceActiveSet(true)

    } else if (e.target.innerHTML === '기본 배송지 선택 완료') {
      e.target.innerHTML = '기본 배송지 선택하기'
      choiceActiveSet(false)
      const defaultDeliveryIndex = Number(document.querySelector(`.${styles.active}`).getAttribute('data-index'));
      await Apis.put(`/api/shippingaddress/${defaultDeliveryIndex}/default`)
      router.reload()
    }
  }

  const ChoiceHandle = (e) => {
    document.querySelectorAll(`.${styles.deliveryList} li`).forEach((i) => {
      i.classList.remove(styles.active)
    })
    e.currentTarget.classList.add(styles.active)
  }

  const DeleteDelivery = async (itemid) => {
    const check = confirm("정말 삭제하시겠습니까?");
    if (check) {
      await Apis.delete(`/api/shippingaddress/${itemid}`,
        { headers: { 'Authorization': `Bearer ${getCookie('accessToken')}` } }
      ).then((res) => {
        delete dummyData[itemid]
        deliveryListSet(dummyData)
        if (res.data.errors !== null && res.data.errors !== undefined) {
          alert(res.data.message)
        }
        router.reload()
      }).catch((err) => {
        // alert("서버와 통신이 완료되지 못하였습니다."),console.log(err)
      })
    }
  }

  if (isLogin === "true")
    return (
      <>
        <PageTop backPath={`/user/myPage`}>배송지 관리 <Link className={styles.deliveryAdd} href={`${router.pathname}/deliveryAdd`}>배송지 추가</Link></PageTop>
        <div className={styles.deliveryListWrap}>
          {
            deliveryList.length === 0 ? (<div className={styles.noDelivery}>등록된 배송지가 없습니다.</div>) :
              (
                <>
                  <ul className={styles.deliveryList + (choiceActive ? ` ${styles.choiceActive}` : '')}>
                    {
                      deliveryList.map((item, index) => {
                        return (
                          <li
                            onClick={(e) => { choiceActive && !item.defaultAddress ? ChoiceHandle(e) : '' }}
                            key={index}
                            data-index={item.id}
                            className={item.defaultAddress ? styles.basic : ''}
                          >
                            <div className={styles.name}>
                              {item.receiverName}
                              {item.defaultAddress ? <span className={styles.basicCheck}>기본배송지</span> : ""}
                            </div>
                            <div className={styles.address}>[{item.zipCode}] {item.address}</div>
                            {item.addressDetail !== '' && <div className={styles.addressDetail}>{item.addressDetail}</div>}
                            {item.phone1 !== '' && <div className={styles.phone}>{item.phone1}</div>}
                            {item.phone2 !== '' && <div className={styles.phone}>{item.phone2}</div>}
                            <span className={styles.buttonWrap}>
                              {!item.defaultAddress && <Button variantStyle="white" sizeStyle="sm" onClick={() => { DeleteDelivery(item.id) }}>삭제</Button>}
                              <Button variantStyle="white" sizeStyle="sm" onClick={() => { router.push('/user/deliveryEdit?id=' + item.id) }}>수정</Button>
                            </span>
                          </li>
                        )
                      })
                    }
                  </ul>
                  <div className={styles.deliverSubmit}>
                    <p>위 목록에서 배송지를 선택해주세요.</p>
                    <Button variantStyle="color" sizeStyle="lg" onClick={(e) => DefaultChoice(e)}>기본 배송지 선택하기</Button>
                  </div>
                </>
              )
          }
        </div>
      </>
    )
}


DeliveryList.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = getToken(context)
  const res = await serverSideGetApi('/api/shippingaddress', accessToken, refreshToken, context)
  const deliveryListData = await res.data || [];
  return {
    props:
      { deliveryListData }
  }
}