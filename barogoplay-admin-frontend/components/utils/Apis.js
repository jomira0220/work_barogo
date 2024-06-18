import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next'


const accessToken = getCookie('accessToken');
const refreshToken = getCookie('refreshToken');

const Apis = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_KEY}`,
  headers: {
    // 'Authorization': `Bearer ${accessToken}`,
    'Content-type': 'application/json;charset=UTF-8'
  },
  withCredentials: true,
  crossDomain: true,
  // timeout: 1500,
});


//요청시 AccessToken 계속 보내주기
Apis.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';
    if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config
  },
  (error) => {
    return console.log('error', error);
    ;
  }
);


//AccessToken이 만료됐을때 처리
Apis.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log('error.response', error);

    if (refreshToken === undefined) {
      alert("로그인이 필요한 서비스로 로그인 페이지로 이동합니다.")
      return location.href = `${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`
      return location.href = `${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`
    }

    // 엑세스토큰 만료시 리프레시 토큰으로 새로운 엑세스 토큰 요청
    if (error.response?.status === 401) {
      console.log("토큰 만료")

      const originalRequest = error.response.config;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_KEY}/api/token/refresh`, {},
        {
          headers: {
            'Authorization': `Bearer ${refreshToken}`,
            'Content-type': 'application/json;charset=UTF-8',
          }
        }
      ).then((res) => {
        // 리프레시 토큰을 요청했는데 성공했을 경우 - 상태코드 200, status: success
        if (res.data.status === "success" && res.status === 200) {
          let newAccessToken = res.data.data.accessToken;
          // console.log("리프레시토큰응답", newAccessToken)
          setCookie('accessToken', newAccessToken, { path: "/" });
          // setCookie('refreshToken', refreshToken, { maxAge: 1 * 60 * 50, path: "/" });
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // 새로 발급받은 엑세스토큰 헤더에 저장
          return axios(originalRequest); // 재요청
        }
      }).catch((err) => {
        console.log('err', err);
      });
    } else if (error.response?.status === 404) {
      location.href = '/404'
    }
  }
);

export default Apis