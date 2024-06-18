import LayoutBox from "@/components/LayoutBox/LayoutBox";
import PageTop from "@/components/PageTop/PageTop";
import styles from "@/pages/board/edit/edit.module.scss";
import Button from "@/components/Button/Button";
import TagInputBox from "@/components/TagInputBox/TagInputBox";
import { useEffect, useState } from "react";
import ReactQuillContainer from "@/components/ReactQuill/ReactQuillContainer";
import { loginCheck } from "@/utils/loginCheck";
import VoteSetBox from '@/components/VoteBox/VoteSetBox';
import { BoardSubmit } from "@/utils/BoardSubmit";


export default function BoardWrite(props) {

  const { isLogin, writePage } = props;

  useEffect(() => {
    // 관리자 게시판의 경우에는 작성불가 메인 페이지로 이동 처리
    if (writePage === "event" || writePage === "benefit" || writePage === "news") {
      location.href = process.env.NEXT_PUBLIC_DOMAIN_URL;
    }
  }, [writePage])

  loginCheck(isLogin);


  // PageTop 게시판 이름 노출
  const boardNameList = { free: "자유", activity: "활동인증", junggo: "중고거래", };
  const boardName = boardNameList[writePage];

  const [voteItemContent, setVoteItemContent] = useState(["", ""]); // !투표 항목 내용
  const [voteTitle, setVoteTitle] = useState(""); // !투표 제목 


  // 관리자 게시판의 경우 게시글 작성 불가
  if (writePage === "event" || writePage === "benefit" || writePage === "news") {
    return null;
  }

  // 로그인이 되어있는 상태
  if (isLogin === "true")
    return (
      <>
        <PageTop backPath={`/board/${writePage}`}>
          {boardName} 게시판 글쓰기
        </PageTop>

        <div className={styles.boardWriteWrap}>
          <input
            id="title"
            className={styles.writeTitle}
            type="text"
            placeholder="제목을 입력하세요. 30자이내"
            maxLength={30}
            autoFocus
          />

          <ReactQuillContainer />
          <VoteSetBox
            voteItemContent={voteItemContent}
            setVoteItemContent={setVoteItemContent}
            voteTitle={voteTitle}
            setVoteTitle={setVoteTitle}
          />

          <div className={styles.tagTitle}>해시태그</div>
          <TagInputBox tagData={[]} />
          <Button
            variantStyle="color"
            sizeStyle="lg"
            onClick={() => BoardSubmit("write", voteTitle, voteItemContent, { writePage })}
          >등록하기
          </Button>
        </div>
      </>
    );
}

BoardWrite.getLayout = function getLayout(page) {
  return <LayoutBox>{page}</LayoutBox>;
};

export const getServerSideProps = async (context) => {
  const { id } = context.query;
  const writePage = id[0];
  return {
    props: {
      writePage,
    },
  };
};
