import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next'

const accessToken = getCookie('accessToken');
const refreshToken = getCookie('refreshToken');

axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;

const CustomApis = axios.create({
  withCredentials: true,
  crossDomain: true,
});


//요청시 AccessToken 계속 보내주기
CustomApis.interceptors.request.use(
  (config) => {

    if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
    config.headers["Content-Type"] = 'application/json';
    config.withCredentials = true;
    config.crossDomain = true;

    return config
  },
  (error) => {
    return Promise.reject(error);
  }
);

//AccessToken이 만료됐을때 처리
CustomApis.interceptors.response.use(
  (response) => {
    console.log('response', response);
    // if (response.status === 404) {
    //   location.href = '/404'
    // }
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // 엑세스토큰 만료시 리프레시 토큰으로 새로운 엑세스 토큰 요청
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_KEY}/api/token/refresh`, {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": 'application/json',
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
          return axios(originalRequest); // 재요청
        }
      }).catch((err) => {
        console.log('err', err);
      });
    } else if (error.response?.status === 404) {
      location.href = '/404'
    }
    return Promise.reject(error);
  }
);

export default CustomApis