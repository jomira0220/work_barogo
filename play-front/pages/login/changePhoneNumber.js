import LayoutBox from "@/components/LayoutBox/LayoutBox";
import { useEffect } from "react";
import CustomApis from '@/utils/CustomApis';
import axios from 'axios';
import util from "util";
import bodyParser from "body-parser";

export default function ChangePhoneNumber(props) {
  // !!! 마이페이지 핸드폰 번호 수정누르고 본인인증하여 들어오는 페이지
  const changeCheck = async () => {

    axios.defaults.withCredentials = true;
    axios.defaults.crossDomain = true;

    const checkRes = await axios.put(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/users/info`);
    console.log(checkRes, "checkRes 응답")

    if (checkRes.data !== "") {

      const editPhon = await CustomApis.put(
        `${process.env.NEXT_PUBLIC_API_KEY}/api/users/me/info`,
        { "phoneNumber": checkRes.data },
      );

      console.log(editPhon, "editPhon 응답")

      if (editPhon.data !== "") {
        alert("핸드폰 번호 변경을 완료하였습니다.")
        location.href = "/user/accountManagement";
      } else {
        alert("핸드폰 번호 변경에 실패하였습니다.")
      }

    } else {
      alert("핸드폰 번호가 확인되지 않습니다.")
    }
  }

  useEffect(() => {
    changeCheck()
  }, []);


  return (
    <></>
  )
}

ChangePhoneNumber.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};


export const getServerSideProps = async (context) => {
  const getBody = util.promisify(bodyParser.urlencoded());
  await getBody(context.req, context.res);
  const params = context.req.body;
  return {
    props: { params },
  };
};