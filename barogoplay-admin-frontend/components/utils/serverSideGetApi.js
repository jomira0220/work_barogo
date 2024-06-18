
import axios from 'axios'

export const getToken = (context) => {
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

export const serverSideGetApi = async (url, accessToken, refreshToken, context) => {

  const ApiUrl = process.env.NEXT_PUBLIC_API_KEY;
  const Res = await axios.get(`${ApiUrl}${url}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-type': 'application/json;charset=UTF-8',
      }
    })
    .then((res) => {
      return res.data
    }).catch(async (err) => {
      console.log("err", err)

      if (refreshToken === undefined || accessToken === undefined) {
        alert("로그인이 필요한 서비스로 로그인 페이지로 이동합니다.")
        return location.href = `${process.env.NEXT_PUBLIC_API_KEY}/oauth2/authorization/barogo?redirect_url=${process.env.NEXT_PUBLIC_DOMAIN_URL}/login/callback`
      }

      // 엑세스토큰 만료시 리프레시 토큰으로 새로운 엑세스 토큰 요청
      if (err.response?.status === 401) {
        console.log("토큰 만료")

        const originalRequest = err.response.config;
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_KEY}/api/token/refresh`, {},
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
            // let expiresIn = res.data.data.expiresIn;
            context.res.setHeader('Set-Cookie', `accessToken=${newAccessToken}; Path=/;`);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`; // 새로 발급받은 엑세스토큰 요청 헤더에 저장
            return axios(originalRequest); // 요청 재시도
          }
        })

      }
    })

  return Res

}

