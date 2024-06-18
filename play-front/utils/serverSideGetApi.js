
import axios from 'axios'

export const getToken = (context) => {
  const cookie = context !== undefined && context.req.headers.cookie ? context.req.headers.cookie : ""
  const token = cookie
    .split('; ')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});
  if (token.accessToken === undefined || token.refreshToken === undefined) return { accessToken: "", refreshToken: "" }
  return { accessToken: token.accessToken, refreshToken: token.refreshToken }
}

export const serverSideGetApi = async (url, accessToken, refreshToken, context) => {

  axios.defaults.withCredentials = true;
  axios.defaults.crossDomain = true;

  const ApiUrl = process.env.NEXT_PUBLIC_API_KEY;
  const ResHeader = {
    headers: {
      "Content-Type": 'application/json',
    },
    withCredentials: true,
    crossDomain: true,
  }
  if (accessToken) { //! accessToken이 있을 경우에만 추가
    ResHeader.headers.Authorization = `Bearer ${accessToken}`
  }

  const Res =
    await axios.get(`${ApiUrl}${url}`, ResHeader)
      .then((res) => {
        return res.data
      }).catch(async (err) => {

        // 엑세스토큰 만료시 리프레시 토큰으로 새로운 엑세스 토큰 요청
        if (err.response?.status === 401) {
          await axios.post(
            `${ApiUrl}/api/token/refresh`, {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
                "Content-Type": 'application/json',
              },
              withCredentials: true,
              crossDomain: true,
            }
          ).then((res) => {
            // 토큰을 요청했는데 성공했을 경우 - 상태코드 200, status: success
            if (res.data.status === "success" && res.status === 200) {
              let originalRequest = err.response.config;
              let newAccessToken = res.data.data.accessToken;
              context.res.setHeader('Set-Cookie', `accessToken=${newAccessToken}; Path=/;`);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // 새로 발급받은 엑세스토큰 요청 헤더에 저장
              return axios(originalRequest); // 재요청
            }
          }).catch((err) => {
            context.res.setHeader(
              "Set-Cookie", [
              `accessToken=deleted; Max-Age=0`,
              `refreshToken=deleted; Max-Age=0`]
            );
          })
        }
      })

  return Res;
}

