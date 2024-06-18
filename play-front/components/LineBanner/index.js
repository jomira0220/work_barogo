
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import styled from 'styled-components';
import Link from 'next/link';
import axios from 'axios';
import Apis from '@/utils/Apis';

const LineBannerWrap = styled.div`
  background-color: var(--play-color-1);
  text-align: left;
  text-align: center;
  
  .swiper-slide {
    &:nth-child(even) {
      background-color: var(--play-color-1);
    }
    &:nth-child(odd) {
      background-color: var(--play-color-2);
    }
    a, & > div {
      padding: var(--space-1) 0;
      color: var(--white-color-1);
      white-space: nowrap;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10%;
      animation: flowText 10s linear infinite; 
      -webkit-animation: flowText 10s linear infinite; 
      font-size: 0.8rem;
    }
  }
  @keyframes flowText {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-100%); }
  }
  @keyframes blink {
    0% { color:#fff; }
    100% { color:var(--play-color-1) }
  }

`
export default function LineBanner(props) {

  const [bannerData, setBannerData] = useState([]);

  const clickCount = async (itemId) => {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_KEY}/api/advertisements/${itemId}/count`)
    console.log("배너 클릭 카운트 api", res)
  }

  useEffect(() => {
    const getTextBannerData = async () => {
      const textBannerRes = await axios.get(`${process.env.NEXT_PUBLIC_API_KEY}/api/advertisements?type=text`)
      console.log("텍스트 배너 호출 api", textBannerRes)
      const textBannerData = await textBannerRes.data.data || [];

      const brandRes = await Apis.get("/api/users/me/brand")
      console.log("브랜드 데이터 호출 api", brandRes)
      const brandData = await brandRes.data || [];

      if (brandData.status === "error" || brandData === null) {
        // 미로그인 상태이거나 브랜드 데이터가 없을 경우
        const AllBanner = textBannerData.filter((item) => item.targetCompany.includes("ALL"))
        setBannerData(AllBanner)
      } else {
        // 브랜드 데이터가 있을 경우 해당 브랜드 배너만 필터링하거나 ALL이 포함된 배너만 노출
        const brandBanner = textBannerData.filter((item) => item.targetCompany.includes(brandData.data) || item.targetCompany.includes("ALL"))
        setBannerData(brandBanner)
      }

    }
    getTextBannerData()
  }, [])

  console.log('bannerData', bannerData)

  if (bannerData !== null)
    return (
      <LineBannerWrap>
        <Swiper
          className="lineBanner"
          modules={[Autoplay, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          // loop={true}
          autoplay={{ delay: 5000 }}
        >
          {bannerData.map((item, index) => {
            return (
              <SwiperSlide key={index} className={"slide_" + (index + 1)}>
                {item.link !== null && item.link !== "" ? (
                  <Link href={item.link} onClick={() => clickCount(item.id)}>
                    <span>{item.name}</span>
                    <span>{item.name}</span>
                    <span>{item.name}</span>
                    <span>{item.name}</span>
                    <span>{item.name}</span>
                    <span>{item.name}</span>
                  </Link>
                ) : ( // 링크가 없을 경우
                  <div onClick={() => clickCount(item.id)}>
                    <span>{item.name}</span>
                    <span>{item.name}</span>
                    <span>{item.name}</span>
                    <span>{item.name}</span>
                    <span>{item.name}</span>
                    <span>{item.name}</span>
                  </div>
                )}
              </SwiperSlide>
            )
          })}
        </Swiper>
      </LineBannerWrap>
    )
}


