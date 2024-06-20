import Layout from "@/components/Layout/Layout";
import ReactQuillContainer from "@/components/ReactQuill/ReactQuillContainer";
import Button from "@/components/Button/Button";
import styles from "./edit.module.scss";
import { useState } from "react";
import { getToken, serverSideGetApi } from "@/components/utils/serverSideGetApi";
import { useRouter } from "next/router";
import Apis from "@/components/utils/Apis";

export default function NoticeEdit(props) {
  const router = useRouter();
  const { isLogin, detailId, editPostData } = props;

  console.log("플레이 운영 공지 상세", editPostData, isLogin);

  // !게시글 수정 api 호출
  const EditSubmit = async () => {

    // ~게시글 전체 데이터
    const writeData = {
      // postType: "GENERAL",
      title: document.getElementById("title").value,
      content: document.querySelector(".ql-editor").innerHTML,
      hashtags: { tagNameList: [] }, // ["태그1" , "태그2"]
      thumbnailImageUrl: "",
      reservedDate: "",
      commentEnabled: false, // 댓글 활성화 여부 - 시스템공지는 무조건 false
      vote: {},
      postMeta: {
        startDate: "",
        endDate: "",
        targetCompany: ["BAROGO", "DEALVER", "MOALINE"]
      }
    };

    console.log("게시글 전체 데이터", writeData);

    // ~게시글 내용 수정 api 호출
    const EditRes = await Apis.put(`/api/boards/system/posts/${detailId}`, writeData);
    console.log("게시글 내용 수정 api 상태", EditRes);

    if (EditRes.status === 200 && EditRes.data.status !== "error") {
      alert("게시글이 수정되었습니다.");
      router.reload()
    } else {
      alert("게시글 수정에 실패했습니다. 사유 : " + EditRes.data.message || "알수없음");
    }
  };


  //! 게시글 삭제 api 호출
  const DeleteSubmit = async () => {
    const DeleteRes = await Apis.delete(`/api/boards/system/posts/${detailId}`);
    console.log("게시글 삭제 api 상태", DeleteRes);
    if (DeleteRes.status === 200 && DeleteRes.data.status !== "error") {
      alert("게시글이 삭제되었습니다.");
      router.back()
    } else {
      alert("게시글 삭제에 실패했습니다. 사유 : " + DeleteRes.data.message || "알수없음");
    }
  }

  if (isLogin === "true" && editPostData !== null)
    return (
      <div className='basicBox'>
        <h2>플레이 운영 공지 상세</h2>
        <div className={styles.boardWriteWrap}>
          <div className={styles.line}>
            <h5>제목</h5>
            <input id="title" className={styles.writeTitle} type="text" placeholder="제목을 입력하세요." defaultValue={editPostData.title} />
          </div>

          <ReactQuillContainer className={styles.adminBoardContent} content={editPostData.content} />

          <div className={styles.buttonWrap}>
            <Button className={styles.editBtn} variantStyle="color" sizeStyle="sm" onClick={() => EditSubmit()}>
              수정하기
            </Button>
            <Button className={styles.editBtn} variantStyle="darkgray" sizeStyle="sm" onClick={() => DeleteSubmit()}>
              삭제하기
            </Button>
          </div>
        </div>

      </div>
    );
}

NoticeEdit.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export const getServerSideProps = async (context) => {
  const { accessToken, refreshToken } = await getToken(context);
  const { detailId } = context.query;
  const editDataRes = await serverSideGetApi(`/api/boards/system/posts/${detailId}`, accessToken, refreshToken, context);
  const editPostData = (await editDataRes.data) || null;

  return {
    props: {
      editPostData,
      detailId,
    },
  };
};
