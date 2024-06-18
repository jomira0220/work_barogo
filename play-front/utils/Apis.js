import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next'

const ApiUrl = process.env.NEXT_PUBLIC_API_KEY;
const accessToken = getCookie('accessToken');
const refreshToken = getCookie('refreshToken');

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;

const Apis = axios.create({
  baseURL: ApiUrl,
  headers: {
    // 'Authorization': `Bearer ${accessToken}`,
    "Content-Type": 'application/json'
  },
  withCredentials: true,
  crossDomain: true,
});

if (accessToken) {
  Apis.defaults.headers.Authorization = `Bearer ${accessToken}`;
}

// console.log('Apis 확인', Apis.defaults.headers)

//요청시 AccessToken 계속 보내주기
Apis.interceptors.request.use(
  (config) => {
    if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
    config.headers["Content-Type"] = 'application/json';
    config.withCredentials = true;
    config.crossDomain = true;
    // console.log('config 확인', config.headers)
    return config
  },
  (error) => {
    // console.log('error확인', error);
    return Promise.reject(error);
  }
);

//AccessToken이 만료됐을때 처리
Apis.interceptors.response.use(
  (response) => {
    if (response.status === 404) {
      location.href = '/404';
    }
    return response;
  },
  async (error) => {

    if (error.response?.status === 401) {
      // console.log('error.response', error.response)
      // 엑세스토큰 만료시 리프레시 토큰으로 새로운 엑세스 토큰 요청
      await axios.post(
        `${ApiUrl}/api/token/refresh`, {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": 'application/json;charset=UTF-8',
          },
          withCredentials: true,
          crossDomain: true,
        }
      ).then((res) => {
        // 리프레시 토큰을 요청했는데 성공했을 경우 - 상태코드 200, status: success
        if (res.data.status === "success" && res.status === 200) {
          let originalRequest = error.response.config;
          let newAccessToken = res.data.data.accessToken;
          setCookie('accessToken', newAccessToken, { path: "/" });
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // 새로 발급받은 엑세스토큰 헤더에 저장
          return axios(originalRequest) // 재요청
        }
      }).catch((err) => {
        console.log('err', err);
      })
    } else if (error.response?.status === 500) {
      location.href = '/500';
    }
    return Promise.reject(error);
  }
);

export default Apis