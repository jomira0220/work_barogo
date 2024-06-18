import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/router';
import Apis from '@/utils/Apis';
import Image from 'next/image';

const BannerLink = styled.a`
display: block;
width: 100%;
height: 100%;

.marketingBanner {
  background-color: var(--white-color-1);
  color: var(--white-color-1);
  height: 100%;
}

img{
margin: 0;
padding: 0;
width: 100%;
height: auto;
}

`

const SlideBox = styled.div`
    .swiper-pagination-bullet-active {
        background-color:var(--play-color-1);
    }
    .swiper-pagination {
        top:auto;
        bottom:3px;
        /* opacity: 0.8; */
    }
    .swiper-pagination-progressbar-fill{
        background-color: var(--play-color-1);
    }

`

export default function MarketingBanner() {

    const router = useRouter();

    const [bannerData, setBannerData] = useState([]);

    const clickCount = async (itemId) => {
        const res = await axios.put(`${process.env.NEXT_PUBLIC_API_KEY}/api/advertisements/${itemId}/count`)
        const data = await res.data;
        console.log("배너 클릭 카운트", data)
    }

    useEffect(() => {
        const getBanner = async () => {
            const bannerRes = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}/api/advertisements?type=image`)
            const bannerData = await bannerRes.data.data || [];
            console.log("배너 데이터", bannerData)

            const brandRes = await Apis.get("/api/users/me/brand")
            const brandData = await brandRes.data || [];
            console.log("브랜드 데이터", brandData)


            if (brandData.status === "error" || brandData === null) {
                // 미로그인 상태이거나 브랜드 데이터가 없을 경우
                const AllBanner = bannerData.filter((item) => item.targetCompany.includes("ALL"))
                setBannerData(AllBanner)
            } else {
                // 브랜드 데이터가 있을 경우 해당 브랜드 배너만 필터링하거나 ALL이 포함된 배너만 노출
                const brandBanner = bannerData.filter((item) => item.targetCompany.includes(brandData.data) || item.targetCompany.includes("ALL"))
                setBannerData(brandBanner)
            }
        }
        getBanner();
    }, [])

    return (
        bannerData.length > 0 &&
        <SlideBox>
            <Swiper
                className="marketingBanner"
                modules={[Autoplay, Pagination]}
                pagination={{ clickable: false, type: 'progressbar' }}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 3000,
                    // disableOnInteraction: false
                }}
            >
                {
                    bannerData.map((item, index) => {
                        let link = item.link.includes("http")
                            ? item.link.includes("?")
                                ? item.link + "&backPath=" + router.asPath
                                : item.link + "?backPath=" + router.asPath
                            : "/";

                        if (process.env.NEXT_PUBLIC_RUN_MODE === "local") {
                            link = link.replace("https://play.barogo.in", "http://localhost:3000")
                        }

                        const inPageLinkCheck = ["riderplay.co.kr", "play.barogo.in", "localhost:3000"]
                        const inPageLink = inPageLinkCheck.some((link) => item.link.includes(link))
                        console.log(item.image)

                        return (
                            <SwiperSlide key={index}>
                                <BannerLink
                                    href={link}
                                    target={inPageLink ? "_self" : "_blank"}
                                    onClick={() => clickCount(item.id)}
                                >
                                    <Image
                                        src={item.image && item.image.includes("http")
                                            ? item.image
                                            : "https://api.riderplay.co.kr/api/images/ddd_1707268393827_1707962027817.jpg"}
                                        alt={item.name}
                                        width={700}
                                        height={194}
                                        priority={true}
                                    />
                                </BannerLink>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </SlideBox>
    )
}


