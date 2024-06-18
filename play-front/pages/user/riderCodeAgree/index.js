import PageTop from '@/components/PageTop/PageTop'
import LayoutBox from '@/components/LayoutBox/LayoutBox'
import Button from '@/components/Button/Button'
import styles from './riderCodeAgree.module.scss'
import { useEffect, useState } from 'react'
import { LineBasicArrow } from '@/components/Icon/Icon';
import { useRouter } from 'next/router';
import Apis from '@/utils/Apis';
import bodyParser from 'body-parser'
import util from 'util'
import { LinkingCloseSet } from '@/utils/LinkingCloseSet';


export default function RiderCodeAgree(props) {

    const router = useRouter();
    const { phoneNumber } = props.params;

    useEffect(() => {
        // 핸드폰 번호가 없으면 핸드폰 번호 입력 페이지로 이동
        if (phoneNumber === "undefined" || phoneNumber === "" || phoneNumber === null || phoneNumber === undefined) {
            location.href = '/user/riderPhoneNumber';
        }
    }, [phoneNumber]);


    const [riderCode, setRiderCode] = useState(null);
    const [hubCode, setHubCode] = useState(null);
    const [brandCode, brandCodeSet] = useState("none");
    const [riderCodeData, riderCodeDataSet] = useState(null);


    // ! 라이더앱에 푸시메시지 보내기
    const appPushHandler = async () => {
        const pushRes = await Apis.post("/api/accounts/authorize", {
            brandCode: brandCode,
            riderCode: riderCode,
            message: "라이더플레이 인증번호"
        })
        console.log("라이더앱 푸시메시지 발송 api", pushRes)
        if (pushRes.status === 200 && pushRes.data.data) {
            // 푸시메시지 전송 완료시 인증번호 입력 페이지로 이동
            document.querySelector(`.certificationPostBtn`).click()
        } else {
            alert(pushRes.data.message)
        }
    }

    //! 라이더 코드 조회 - 계정검색
    const riderCodeSearch = async () => {
        setPushAppNumber(false) // 라이더앱에 인증번호 보내기 버튼 미노출

        if (brandCode === "none") {
            alert("브랜드를 선택해주세요.");
            return;
        }

        // 선택한 브랜드 및 회원정보에 저장된 연락처로 등록 가능한 라이더계정 조회
        const riderCodeRes = await Apis.get(`/api/accounts?brandCode=${brandCode}&phoneNumber=${phoneNumber}`)
        console.log("등록 가능한 라이더 계정 조회 api", riderCodeRes)

        if (riderCodeRes.status === 200 && riderCodeRes.data.status === "success") {
            const riderCodeListData = await riderCodeRes.data.data.accounts;
            console.log("등록 가능한 라이더 코드 데이터 api", riderCodeListData)

            riderCodeDataSet(riderCodeListData); // 등록 가능한 라이더 코드 목록 저장
            setMoreView(new Array(riderCodeListData.length).fill(false)); // 라이더 코드 자세히 보기 뷰 초기화
        } else {
            riderCodeDataSet([]);
            console.log("라이더 코드 조회 실패 사유 : ", riderCodeRes.data.message)
        }

    }


    // !더보기 버튼 클릭시 더보기 뷰
    const [moreView, setMoreView] = useState([]);

    //! 라이더앱에 인증번호 보내기 노출
    const [pushAppNumber, setPushAppNumber] = useState(false);

    // ! 라이더 코드 클릭시 
    const ButtonHandler = (e, index, riderCode, hubCode, moreView, setMoreView, setRiderCode, setHubCode) => {

        const newMoreView = [...moreView];
        // 라이더 코드 자세히 보기 클릭시 클릭하지 않은 다른 라이더 코드 자세히 보기 닫기
        newMoreView.map((item, idx) => { if (idx !== index) { newMoreView[idx] = false; } })
        // 클릭한 라이더 코드 자세히 보기 열기/닫기
        newMoreView[index] = newMoreView[index] ? false : true;

        // 클릭한 라이더 코드 정보 저장
        setMoreView(newMoreView);
        setRiderCode(riderCode);
        setHubCode(hubCode);

        // 라이더앱에 인증번호 보내기 버튼 노출 처리
        newMoreView.includes(true) ? setPushAppNumber(true) : setPushAppNumber(false);
    }

    // !브랜드 라이더 신규 가입 페이지로 이동
    const brandRiderJoin = (brandCode) => {
        const brandJoinUrl = {
            BAROGO: "https://www.barogo.com/riderInquiry",
            MOALINE: "https://www.moaline.com/sub/sub3.php?Rider",
            DEALVER: "https://www.dealver.co.kr/homepage/inquiry_v2",
        }
        router.push(`${brandJoinUrl[brandCode]}`);
    }

    // !브랜드 선택시 
    const brandChangeSet = (e) => {
        riderCodeDataSet(null); // 라이더 코드 목록 초기화
        brandCodeSet(e.target.value); // 선택한 브랜드 코드 저장
    }

    const BrandNameKo = {
        BAROGO: "바로고",
        MOALINE: "모아라인",
        DEALVER: "딜버",
    }

    return (
        <>
            <PageTop backPath="/user/riderPhoneNumber">
                라이더 계정 찾기
                <div className={styles.closeRiderCode} onClick={() => LinkingCloseSet()}>연동 종료</div>
            </PageTop>
            <div className={styles.riderCodeAgreeWarp}>
                <div className={styles.inner}>
                    <h2>선택한 브랜드에서<br /><b>라이더 계정</b>을 찾습니다.</h2>
                    <p>브랜드를 선택해 사용중인 계정을 찾습니다.</p>
                    <div className={styles.selectBrand}>
                        <select defaultValue={"none"} name="selectBrand" onChange={(e) => brandChangeSet(e)}>
                            <option value="none" disabled>브랜드 선택</option>
                            <option value="BAROGO">바로고</option>
                            <option value="MOALINE">모아라인</option>
                            <option value="DEALVER">딜버</option>
                        </select>
                        <Button variantStyle="color2" onClick={() => riderCodeSearch()}>계정검색</Button>
                    </div>
                </div>


                {(brandCode !== "none" && riderCodeData && riderCodeData.length === 0) && (
                    <div className={styles.notFind}>
                        <p>
                            <b className={styles.color}>{BrandNameKo[brandCode]}</b>에서 인증하신<br />
                            휴대 전화 번호 정보와 일치하는<br />
                            <b>라이더 계정를 찾지 못했습니다.</b>
                        </p>
                        <Button variantStyle="color" sizeStyle="md" onClick={() => brandRiderJoin(brandCode)}>
                            {BrandNameKo[brandCode]} 라이더 신규 가입
                        </Button>
                    </div>
                )}

                {riderCodeData && riderCodeData.length > 0 && (
                    <div className={styles.brandButtonList}>
                        {
                            riderCodeData.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={styles.codeChoice + (moreView[index] ? ` ${styles.active}` : "")}
                                        onClick={(e) => ButtonHandler(e, index, item.riderInfo.riderCode, item.hubInfo.hubCode, moreView, setMoreView, setRiderCode, setHubCode)}
                                    >
                                        <div className={styles.buttonArea}>
                                            <button className={styles.codeChoiceBtn}>
                                                <div className={styles.riderCode}>{brandCode === "MOALINE" ? "MOALINE" : item.riderInfo.riderCode}</div>
                                                {item.hubInfo.hubName}
                                            </button>
                                            <div className={styles.moreBtn}>자세히보기<LineBasicArrow color={"var(--gray-color-1)"} /></div>
                                        </div>

                                        {moreView[index] && (
                                            <ul className={styles.riderCodeDetail}>
                                                <li>
                                                    <span className={styles.title}>가입일자 : </span>
                                                    <span>{(riderCodeData[index].riderInfo.registrationDate.dateTime).replace(/-/g, ".").replace(/KST/g, " ").replace(/T/g, " ")}</span>
                                                </li>
                                                <li>
                                                    <span className={styles.title}>마지막 활동 일자 : </span>
                                                    <span>{(riderCodeData[index].riderInfo.lastActDate.dateTime).replace(/-/g, ".").replace(/KST/g, " ").replace(/T/g, " ")}</span>
                                                </li>
                                                <li>
                                                    <span className={styles.title}>허브주소 : </span>
                                                    <span>{riderCodeData[index].hubInfo.addressInfo.address1}</span>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                )
                            })
                        }
                    </div>
                )}
            </div>
            {pushAppNumber && (
                <>
                    <div className={styles.appPushBtn}>
                        <Button
                            variantStyle="color"
                            sizeStyle="lg"
                            onClick={() => appPushHandler()}>
                            라이더앱에 인증번호 보내기
                        </Button>
                    </div>
                    <form action="/user/certification" method="post" >
                        <input type="hidden" name="brandCode" value={brandCode} />
                        <input type="hidden" name="hubCode" value={hubCode} />
                        <input type="hidden" name="riderCode" value={riderCode} />
                        <input type="hidden" name="phoneNumber" value={phoneNumber} />
                        <button className="certificationPostBtn" style={{ display: "none" }} type='submit'></button>
                    </form>
                </>
            )}
        </>
    )
}

RiderCodeAgree.getLayout = function getLayout(page) {
    return (<LayoutBox>{page}</LayoutBox>)
}

export const getServerSideProps = async (context) => {
    const getBody = util.promisify(bodyParser.urlencoded());
    await getBody(context.req, context.res);
    const params = context.req.body;
    // console.log(params)
    return {
        props: { params },
    };
};