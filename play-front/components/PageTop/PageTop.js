import { useRouter } from 'next/router'
import styles from './PageTop.module.scss'
import { ArrowLeftIcon } from '@/components/Icon/Icon'
import { getParamMap } from '@/utils/getParamMap'


export default function PageTop({ children, backPath }) {
    const router = useRouter()

    const goBack = () => {
        // !path 저장 처리는 _app.js에서 처리
        if (
            router.asPath.includes('/user/certification') ||
            router.asPath.includes('/user/riderPhoneNumber')
        ) {
            return backPath()
        }

        const prevPath = JSON.parse(sessionStorage.getItem('prevPath')) // 이전 경로 배열
        const currentPath = sessionStorage.getItem('currentPath') // 현재 경로

        // 누적된 경로 배열에서 현재 경로와 다른 첫번째 경로를 찾음 (쿼리를 제외한 경로만 비교)
        const numberCheck = /[0-9]/g
        const notSamePath = prevPath.filter((path, index) =>
            // 쿼리를 제외한 경로 비교하여 같지 않거나 숫자를 제외한 경로 비교하여 같지 않으면 반환
            (path.split("?")[0] !== currentPath.split("?")[0])
            && (path.replace(numberCheck, '') !== currentPath.replace(numberCheck, ''))
            && !getParamMap(path).backPath // 경로에 뒤로가기 경로가 있으면 제외
        )[0] || []



        console.log("이동할 경로", notSamePath)

        const queryBackPath = getParamMap(location.href) // 쿼리로 받은 뒤로가기 경로가 있는지 확인
        if (queryBackPath.backPath) {
            // 쿼리로 받은 뒤로가기 경로가 있으면 해당 경로로 이동
            router.push(queryBackPath.backPath)
        } else if (prevPath.length === 0 || notSamePath.length === 0) {
            // 누적된 경로가 없거나 누적된 경로가 현재 경로와 모두 같은 경우 메인으로 이동 (페이징을 여러번 클릭한 경우)
            router.push("/")
        } else {

            // 숫자와 쿼리를 제외한 뒤로가기 첫번째 경로와 현재 경로 확인
            const prevPathNotQuery = prevPath[0].split("?")[0].replace(numberCheck, '')
            const currentPathNotQuery = currentPath.split("?")[0].replace(numberCheck, '')

            if (
                currentPath === prevPath[0] // 뒤로가려는 경로가 현재 경로와 같은 경우
                || currentPath.includes(prevPath[0].split('?')[0])  // 쿼리를 제외한 경로가 동일한 경우
                || prevPathNotQuery[0] === currentPathNotQuery // 숫자와 쿼리를 제외한 경로가 동일한 경우
                || (prevPath[0].includes("board/detail") && currentPath.includes("board/detail")) // 뒤로가려는 경로와 현재 경로가 모두 게시판 상세 페이지인 경우
            ) {
                // 뒤로가려는 경로가 현재 경로와 같은 경우 다른 경로를 찾아서 이동
                router.push(notSamePath)
            } else if (backPath) {
                // 뒤로가려는 경로를 지정해둔 경우 해당 경로로 이동
                router.push(backPath)
            } else {
                // 뒤로가기로 이동하지 않을 페이지 목록
                const noBackPath = ['/termsOfUse']
                noBackPath.includes(prevPath[0])
                    ? prevPath.length > 1
                        ? currentPath === prevPath[1] || currentPath.includes(prevPath[1].split('?')[0]) // 뒤로가려는 페이지가 현재 페이지인 경우
                            ? router.push(notSamePath)
                            : router.push(prevPath[1])
                        : router.push("/")
                    : router.push(prevPath[0])
            }
        }
    }

    return (
        <div className={styles.pageTop}>
            <button className={styles.backBtn} onClick={() => goBack()}>
                <span className={styles.joinIcon}><ArrowLeftIcon></ArrowLeftIcon></span>
                <span className='blind'>뒤로가기</span>
            </button>
            <h2>{children}</h2>
        </div >
    )
}