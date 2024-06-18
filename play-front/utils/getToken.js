
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
