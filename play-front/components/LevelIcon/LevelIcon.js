import Image from 'next/image';
import styles from './LevelIcon.module.scss';
export default function LevelIcon({ level }) {
  level === null && (level = "D3");
  return <div className={styles.levelIcon}><Image src={`/images/level/small/${level}.png`} alt={level} width={18} height={18} priority /></div>;
}
