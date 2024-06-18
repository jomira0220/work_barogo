import styles from './GalleryBoardList.module.scss'
import BoardIconList from '@/components/BoardIconList/BoardIconList';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function GalleryBoardList({ data, type }) {

    const router = useRouter()

    if (data !== undefined && data !== null)
        return (
            <ul className={styles.galleryBoardList}>
                {
                    data.map((item, index) => {
                        // console.log(item.image)
                        return (
                            <li key={index}>
                                <Link href={`/board/detail/${router.query.eventPage ? router.query.eventPage[0] : "event"}/${item.id}`}>
                                    <div className={styles.imageBox}>
                                        {
                                            router.query.eventPage
                                                ? router.query.eventPage[0] !== "news" && <div className={styles.state + (type ? "" : " " + styles.end)}>{type ? '진행중' : '종료'}</div>
                                                : <div className={styles.state + (type ? "" : " " + styles.end)}>진행중</div>
                                        }
                                        <Image
                                            src={item.image !== null && item.image.includes('http')
                                                ? item.image
                                                : '/images/event1.png'}
                                            alt={item.title} width={500} height={196}
                                            style={{ borderRadius: 'var(--space-3)', width: '100%', height: 'auto' }}
                                            priority={true}
                                        />
                                    </div>
                                    <div className={styles.subject}>{item.title}</div>

                                    {item.hashtags !== null && (item.hashtags !== undefined && item.hashtags.length > 0 && item.hashtags[0] !== "") &&
                                        <div className={styles.tag}>
                                            {item.hashtags.map(tag => {
                                                if (tag === '' || tag === null || tag === undefined) return null
                                                return (
                                                    <span key={tag}>#{tag}</span>
                                                )
                                            })}
                                        </div>
                                    }
                                    <BoardIconList
                                        createdDate={item.createdDate}
                                        viewcount={item.viewCount}
                                        likecount={item.likeCount}
                                        commentcount={item.commentCount}
                                    />
                                </Link>
                            </li>)
                    })
                }
            </ul>
        )
}