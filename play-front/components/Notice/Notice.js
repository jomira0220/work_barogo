import styles from "./Notice.module.scss"
import Link from "next/link"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { useState, useRef, useEffect } from "react";
import { LineBasicArrow } from '@/components/Icon/Icon'

// 시스템 공지와 게시판 공지가 슬라이드 형태로 노출됨
export default function Notice(props) {
    const { boardCode, noticeData } = props;
    const [perView, setPerView] = useState(1);
    const [toggle, setToggle] = useState(false);
    const swiperRefLocal = useRef()

    useEffect(() => {
        setToggle(false)
        setPerView(1)
    }, [boardCode])

    // 공지사항 리스트 토글 처리용
    const noticeToggle = (e) => {
        setToggle(!toggle)
        if (perView === 1) {
            setPerView(noticeData.length)
            swiperRefLocal?.current?.swiper?.autoplay?.stop()
        } else {
            setPerView(1)
            swiperRefLocal?.current?.swiper?.autoplay?.start()
        }
    }

    return (
        noticeData.length === 0 ? null :
            <div className={styles.notice + (toggle ? ` ${styles.active}` : "")}>
                <Swiper
                    className={styles.noticeSlider}
                    modules={[Autoplay]}
                    ref={swiperRefLocal}
                    spaceBetween={0}
                    slidesPerView={perView}
                    direction='vertical'
                    autoplay={{
                        delay: 2500,
                    }}
                >
                    {
                        noticeData.map((item) => {
                            return (
                                <SwiperSlide key={item.id}>
                                    <Link href={`/board/detail/${boardCode}/${item.id}`} passHref>
                                        <h3 className={styles.noticeTitle}>
                                            공지
                                        </h3>
                                        <p className={styles.noticeContent}>
                                            {item.title}
                                        </p>
                                    </Link>
                                </SwiperSlide>
                            )
                        })
                    }
                </Swiper>
                {noticeData.length > 1 && (
                    <div className={styles.listToggle} onClick={(e) => noticeToggle(e)}>
                        <LineBasicArrow direction={toggle ? "up" : "down"} width="7" height="15" />
                    </div>
                )}
            </div>
    )
}

