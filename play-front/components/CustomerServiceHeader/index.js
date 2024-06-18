import styles from './CustomerServiceHeader.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CustomerServiceHeader(props) {
  const router = useRouter();
  return (
    <ul className={styles.myBoardMenu}>
      <li className={!router.asPath.includes("/list") ? styles.active : ""}><Link href="/customerService">자주묻는 질문</Link></li>
      <li className={router.asPath.includes("/list") ? styles.active : ""}><Link href="/customerService/list">문의내역</Link></li>
    </ul>
  )
}