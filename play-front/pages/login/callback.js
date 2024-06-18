import { useRouter } from 'next/router'
import { getCookie, setCookie } from 'cookies-next'

export default function CallbackPage() {

  const router = useRouter()

  const { accessToken, refreshToken } = router.query;

  setCookie('accessToken', accessToken)
  setCookie('refreshToken', refreshToken)


  const loginBeforeUrl = getCookie('beforeLogin')
  console.log("로그인 전 페이지", loginBeforeUrl)
  if (loginBeforeUrl) {
    // 로그인이 필요한 페이지를 방문했을 때 로그인 후 이전 페이지로 돌아가기
    location.href = loginBeforeUrl
  } else if (accessToken && refreshToken) {
    location.href = process.env.NEXT_PUBLIC_DOMAIN_URL
  }

}
