import { useState } from "react";
import styles from "./FileInput.module.scss";
import Image from "next/image";
import axios from "axios";
import { getCookie } from "cookies-next"

export default function FileInput({ setUploadImgUrl, inputInfo, ...props }) {

  const [fileName, setFileName] = useState("");
  const [fileSrc, setFileSrc] = useState(null);
  const [fileValue, setFileValue] = useState("");


  const FileInputHandler = async (e) => {

    const ImageFormData = new FormData();
    let File = e.target.files[0];
    ImageFormData.append("fileList", File, File.name.replace(/\s/g, ""));

    //!이미지 업로드 처리 및 url로 변경 처리
    const res = await axios({
      url: `${process.env.NEXT_PUBLIC_IMG_API_KEY}/api/images/upload`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
        "Content-Type": "multipart/form-data",
      },
      data: ImageFormData,
    })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log("res 에러", err);
      });

    console.log("이미지 업로드 처리 및 url로 변경 처리", res);

    const imgName = await res.data[0].savedUri; //imgName.jpg
    setUploadImgUrl(`${process.env.NEXT_PUBLIC_IMG_API_KEY}/api/images/${imgName}`);

    setFileSrc(`${process.env.NEXT_PUBLIC_IMG_API_KEY}/api/images/${imgName}`);
    setFileName(imgName);
    setFileValue(e.target.value);
  };

  const FileInputReset = () => {
    setFileName("");
    setFileSrc(null);
    setFileValue("");
  }

  return (
    <>
      <div className={styles.fileInputWrap}>
        <label htmlFor={styles.fileInput}>
          {props.title ? <h3>{props.title} {inputInfo ? <span className={styles.noticeSpan}>{inputInfo}</span> : ""}</h3> : ""}
          <div className={styles.fileInput}>
            <div className={styles.inputTitle}>파일 업로드</div>
            <p>{fileName ? <span>{fileName}</span> : "· 파일형식 : jpg,png / 권장사이즈 : 300 * 300"}</p>
          </div>
          <input type="file" id={styles.fileInput} {...props} value={fileValue} onChange={(e) => FileInputHandler(e)} />
        </label>
        {fileSrc && (
          <>
            <div className={styles.fileImage}>
              <p>업로드 이미지</p>
              <Image src={fileSrc} alt="file" width="100" height="100" />
            </div>
            <button className={styles.fileImageRemove} onClick={() => FileInputReset()}>삭제하기</button>
          </>
        )}
      </div>
    </>
  )
}