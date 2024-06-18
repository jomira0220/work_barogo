
import axios from 'axios'

export const Get_Token = (context) => {
  const cookie = context.req.headers.cookie ? context.req.headers.cookie : ""
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

export const Call_API = async (url, accessToken, refreshToken, context) => {

  const ApiUrl = process.env.NEXT_PUBLIC_API_KEY;
  const Res =
    await axios.get(`${ApiUrl}${url}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-type': 'application/json;charset=UTF-8',
        }
      })
      .then((res) => {
        return res.data
      }).catch(async (err) => {
        // 엑세스토큰 만료시 리프레시 토큰으로 새로운 엑세스 토큰 요청
        if (err.response.status === 401 && err.response.data === "Expired") {
          const originalRequest = err.response.config;
          await axios.post(
            `${ApiUrl}/api/token/refresh`, {},
            {
              headers: {
                'Authorization': `Bearer ${refreshToken}`,
                'Content-type': 'application/json;charset=UTF-8',
              }
            }
          ).then((res) => {
            // 토큰을 요청했는데 성공했을 경우 - 상태코드 200, status: success
            if (res.data.status === "success" && res.status === 200) {
              let newAccessToken = res.data.data.accessToken;
              context.res.setHeader('Set-Cookie', `accessToken=${newAccessToken}; Path=/; Expires=${new Date(Date.now() + 1000 * 60 * 30).toUTCString()};`);
              context.res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; Path=/; Expires=${new Date(Date.now() + 1000 * 60 * 50).toUTCString()};`);
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // 새로 발급받은 엑세스토큰 요청 헤더에 저장
              return axios(originalRequest); // 재요청
            }
          }).catch((err) => {
            // 리프레시 토큰이 만료되었을 경우
            context.res.removeHeader("accessToken");
            context.res.removeHeader("refreshToken");
            context.res.removeHeader("loginDate");
            return console.log('error', err);
          })
        }
        return err;
      })

  return Res;
}

export const log_out = async () => {
    const Res =
    await axios.get('https://auth.riderplay.co.kr/logout')
      .then((res) => {
        return res.data
      })
}