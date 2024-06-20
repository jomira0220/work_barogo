import Image from "next/image";
import styles from "./LevelIcon.module.scss";

interface LevelIconProps {
  level: string;
}

const LevelIcon: React.FC<LevelIconProps> = ({ level }) => {
  level === null && (level = "D1");
  return (
    <div className={styles.levelIcon}>
      <Image
        src={`/images/level/small/${level}.png`}
        alt={level}
        width={18}
        height={18}
      />
    </div>
  );
};

export default LevelIcon;
