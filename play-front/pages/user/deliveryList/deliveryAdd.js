import PageTop from '@/components/PageTop/PageTop';
import TextBox from '@/components/Input/TextBox';
import Button from '@/components/Button/Button';
import Postcode from '@/components/PostCode/PostCode';
import styles from './deliveryAdd.module.scss'
import { useState } from 'react';
import LayoutBox from '@/components/LayoutBox/LayoutBox';
import { useRouter } from 'next/router';
import Apis from '@/utils/Apis';
import { loginCheck } from '@/utils/loginCheck';


export default function DeliveryAdd(props) {

    const { isLogin } = props;

    loginCheck(isLogin)

    const router = useRouter();

    const PostDeliveryData = async () => {
        const phone1 = document.querySelector('#phone1').value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
        const phone2 = document.querySelector('#phone2') !== null ? document.querySelector('#phone2').value.replace(/[^0-9]/g, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) : ""
        const newDeliveryData = {
            "receiverName": document.querySelector('#name').value,
            "address": document.querySelector('#address').value,
            "addressDetail": document.querySelector('#addressDetail').value,
            "zipCode": document.querySelector('#postcode').value,
            "phone1": phone1,
            "phone2": phone2,
        }

        const res = await Apis.post('/api/shippingaddress', newDeliveryData);
        console.log("배송지 추가 api", res)
        if (res.status === 200 && res.data.status === 'success') {
            router.push('/user/deliveryList')
        } else {
            alert("배송지 추가에 실패하였습니다 사유 : ", res.data.message)
        }
    }

    // !연락처 추가 제거 컨트롤
    const [contactData, contactDataSet] = useState([""])
    const ContactControl = (type) => {
        const data = [...contactData]
        if (type === 'plus') {
            if (data.length === 2) {
                alert("연락처는 최대 2개까지만 입력 가능합니다.")
            } else {
                data.push({ phone2: '' })
                contactDataSet(data)
            }
        } else if (type === 'minus') {
            if (data.length === 1) {
                alert("연락처는 최소 1개 이상이어야 합니다.")
            } else {
                data.pop()
                contactDataSet(data)
            }
        }
    }

    // !연락처 입력시 숫자만 입력 및 자동 하이픈 입력
    const OninputPhone = (e) => {
        const target = e.target
        target.value = target.value
            .replace(/[^0-9]/g, '')
            .replace(/(^02.{0}|^01.{1}|^03.{1}|^04.{1}|^05.{1}|^06.{1}|^07.{1}|^08.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g, "$1-$2-$3");
    }


    if (isLogin === "true")
        return (
            <>
                <PageTop backPath={'/user/deliveryList'}>배송지 추가</PageTop>
                <div className={styles.deliveryAddWarp}>
                    <TextBox id="name" title='수령인명' placeholder='수령인명' />
                    <div className={styles.addressWrap}>
                        <TextBox id="postcode" title='주소' placeholder='우편번호' readOnly>
                            <Postcode />
                        </TextBox>
                        <TextBox id="address" type='text' placeholder='주소' />
                        <TextBox id="addressDetail" type='text' placeholder='상세주소' />
                    </div>
                    {contactData.map((el, index) => {
                        if (index === 0) {
                            return (
                                <TextBox id="phone1" key={index} title='연락처' placeholder='연락처 1' onChange={(e) => OninputPhone(e)}>
                                    <Button className={styles.contact} variantStyle="white" sizeStyle="sm" onClick={() => ContactControl("plus")}>+</Button>
                                </TextBox>
                            )
                        } else {
                            return (
                                <TextBox id="phone2" key={index} title='연락처' placeholder={`연락처 ${index + 1}`} onChange={(e) => OninputPhone(e)}>
                                    <Button className={styles.contact} variantStyle="white" sizeStyle="sm" onClick={() => ContactControl("minus")}>-</Button>
                                </TextBox>
                            )
                        }
                    })}
                </div>
                <div className={styles.deliveryAddBtn}><Button variantStyle="color" sizeStyle="lg" onClick={() => PostDeliveryData()}>배송지 추가하기</Button></div>
            </>
        )
}


DeliveryAdd.getLayout = function getLayout(page) {
    return <LayoutBox>{page}</LayoutBox>;
};
