import PageTop from "@/components/PageTop/PageTop";
import TextBox from "@/components/Input/TextBox";
import Button from "@/components/Button/Button";
import Postcode from "@/components/PostCode/PostCode";
import styles from "@/pages/user/deliveryList/deliveryAdd.module.scss";
import { useState } from "react";
import LayoutBox from "@/components/LayoutBox/LayoutBox";
import { useRouter } from "next/router";
import TextareaAutosize from "react-textarea-autosize";
import Apis from "@/utils/Apis";
import { getToken, serverSideGetApi } from "@/utils/serverSideGetApi";
import { loginCheck } from "@/utils/loginCheck";

export default function DeliveryEdit(props) {
  const router = useRouter();
  const { data: deliveryData, isLogin } = props;

  loginCheck(isLogin);

  console.log("배송지 데이터", deliveryData);

  // !배송지 수정
  const DeliveryEditSubmit = async () => {
    const selector = (elName) => {
      const el = document.querySelector(`[name="${elName}"]`);
      return el ? el.value : "";
    };

    const editDeliveryData = {
      receiverName: selector("receiverName"),
      zipCode: selector("postcode"),
      address: selector("address"),
      addressDetail: selector("addressDetail"),
      phone1: selector("phone1"),
      phone2: selector("phone2"),
    };
    console.log("배송지수정내용", editDeliveryData);

    if (editDeliveryData.receiverName === "") {
      alert("수령인명을 입력해주세요.");
      return;
    } else if (editDeliveryData.zipCode === "") {
      alert("우편번호를 입력해주세요.");
      return;
    } else if (editDeliveryData.address === "") {
      alert("주소를 입력해주세요.");
      return;
    } else if (editDeliveryData.phone1 === "") {
      alert("1개 이상의 연락처가 필요합니다.");
      return;
    }

    const res = await Apis.put(
      `/api/shippingaddress/${deliveryData.id}`,
      editDeliveryData
    );
    console.log("배송지수정 api", res);
    if (res.status === 200 && res.data.status === "success") {
      router.replace("/user/deliveryList");
    } else {
      alert("배송지 수정에 실패했습니다. 사유 : " + res.data.message)
    }
  };

  // !연락처 추가 제거
  const [contactData, contactDataSet] = useState(
    deliveryData.phone2 === ""
      ? [{ phone1: deliveryData.phone1 }]
      : [{ phone1: deliveryData.phone1 }, { phone2: deliveryData.phone2 }]
  );

  const ContactControl = (type) => {
    const data = [...contactData];
    if (type === "plus") {
      if (data.length === 2) {
        alert("연락처는 최대 2개까지만 입력 가능합니다.");
      } else {
        data.push({ phone2: "" });
        contactDataSet(data);
      }
    } else if (type === "minus") {
      if (data.length === 1) {
        alert("연락처는 최소 1개 이상이어야 합니다.");
      } else {
        data.pop();
        contactDataSet(data);
      }
    }
  };

  // !연락처 입력시 숫자만 입력 및 자동 하이픈 입력 처리
  const OninputPhone = (e) => {
    const target = e.target;
    target.value = target.value
      .replace(/[^0-9]/g, "")
      .replace(
        /(^02.{0}|^01.{1}|^03.{1}|^04.{1}|^05.{1}|^06.{1}|^07.{1}|^08.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g,
        "$1-$2-$3"
      );
  };

  if (isLogin === "true")
    return (
      <>
        <PageTop backPath="/user/deliveryList">배송지 수정</PageTop>
        <div className={styles.deliveryAddWarp}>
          <TextBox
            id="receiverName"
            name="receiverName"
            placeholder="수령인명"
            defaultValue={deliveryData.receiverName}
            title="수령인명"
          />
          <div className={styles.addressWrap}>
            <TextBox
              id="postcode"
              name="postcode"
              placeholder="우편번호"
              defaultValue={deliveryData.zipCode}
              title="주소"
              readOnly
            >
              <Postcode />
            </TextBox>
            <TextareaAutosize
              id="address"
              className={styles.textArea}
              type="text"
              placeholder="주소"
              defaultValue={deliveryData.address}
              name="address"
            />
            <TextBox
              id="addressDetail"
              type="text"
              placeholder="상세주소"
              defaultValue={deliveryData.addressDetail}
              name="addressDetail"
            />
          </div>
          {contactData.map((item, index) => {
            return (
              <TextBox
                id={`phone${index + 1}`}
                key={index}
                title={`연락처${index + 1}`}
                name={`phone${index + 1}`}
                placeholder={`연락처${index + 1}`}
                defaultValue={item[`phone${index + 1}`]}
                onChange={(e) => OninputPhone(e)}
              >
                <Button
                  className={styles.contact}
                  variantStyle="white"
                  sizeStyle="sm"
                  onClick={() =>
                    index === 0
                      ? ContactControl("plus")
                      : ContactControl("minus")
                  }
                >
                  {index === 0 ? "+" : "-"}
                </Button>
              </TextBox>
            );
          })}
        </div>
        <div className={styles.deliveryAddBtn}>
          <Button
            variantStyle="color"
            sizeStyle="lg"
            onClick={() => DeliveryEditSubmit()}
          >
            배송지 수정하기
          </Button>
        </div>
      </>
    );
}

DeliveryEdit.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export async function getServerSideProps(context) {
  const { accessToken, refreshToken } = getToken(context);
  const { id } = context.query;

  if (accessToken) {
    const res = await serverSideGetApi(
      `/api/shippingaddress/${id}`,
      accessToken,
      refreshToken,
      context
    );
    const data = await res.data;
    return {
      props: { data: data },
    };
  } else {
    return {
      redirect: {
        destination:
          "http://dev1.play.barogo.in:8080/oauth2/authorization/barogo",
      },
    };
  }
}
