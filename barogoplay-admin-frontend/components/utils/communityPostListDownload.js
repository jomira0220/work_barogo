import axios from 'axios'
import { getCookie, setCookie } from 'cookies-next'
import { FilterDataSet } from '@/components/utils/FilterDataSet'


//! 게시글 목록 다운로드 함수
export const communityPostListDownload = async (filterCategory, RouterQuery) => {

  const delQueryItem = ["size", "page", "sort", "boardCode"] // api 쿼리에서 제외할 항목
  const defaultQuery = FilterDataSet(filterCategory, RouterQuery) // 기본 설정 쿼리값
  const setQuery = Object.keys(defaultQuery).filter((item) => !delQueryItem.includes(item) && defaultQuery[item] !== "").map((item) => { return item + "=" + defaultQuery[item] }).join("&")

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_KEY}/api/boards/${defaultQuery.boardCode}/posts/download?${setQuery}`,
    {
      responseType: 'blob',
      headers: { 'Authorization': `Bearer ${getCookie('accessToken')}` }
    }
  ).then((res) => {

    console.log("게시글 목록 다운로드 확인", res)

    const url = window.URL.createObjectURL(new Blob([res.data], { type: res.headers["content-type"] }));
    const fileName = decodeURI(res.headers["content-disposition"].split("filename=")[1]);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}`);
    document.body.appendChild(link);
    link.click();

  }).catch(async (error) => {

    console.log("게시글 목록 다운로드 에러", error)

    if (error.response?.status === 401) {
      if (getCookie('refreshToken') === undefined || getCookie('accessToken') === undefined) {
        alert("로그인이 필요한 서비스로 로그인 페이지로 이동합니다.")
        return location.href = `${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`
      }
      const originalRequest = error.response.config;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_KEY}/api/token/refresh`, {},
        {
          headers: {
            'Authorization': `Bearer ${getCookie('refreshToken')}`,
            'Content-type': 'application/json;charset=UTF-8',
          }
        }
      ).then((res) => {
        if (res.data.status === "success" && res.status === 200) {
          let newAccessToken = res.data.data.accessToken;
          setCookie('accessToken', newAccessToken, { path: "/" });
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // 새로 발급받은 엑세스토큰 헤더에 저장
          return axios(originalRequest); // 재요청
        }
      })
    }
  })
}