import { useRouter } from 'next/router'
import { setCookie } from 'cookies-next'

export default function CallbackPage() {
  const router = useRouter();
  const { accessToken, refreshToken, result, resultMessage, expires_in } = router.query;

  if (result === "success") {
    setCookie('accessToken', accessToken)
    setCookie('refreshToken', refreshToken)
    location.href = "/"
  } else if (result === "fail") {
    const alertMessage = resultMessage === "loginFailed" ? "로그인 권한이 없습니다." : resultMessage === "accountDeleted" ? "삭제된 계정입니다." : "로그인에 실패하였습니다."
    alert(alertMessage)
  }

  return (
    <div>
      {/* <h1>로그인 중입니다...</h1> */}
    </div>
  )

}


CallbackPage.getLayout = function getLayout(page) {
  return <>{page}</>
}