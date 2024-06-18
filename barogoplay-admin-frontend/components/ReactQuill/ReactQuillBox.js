import "react-quill/dist/quill.snow.css";
import { useRef, useMemo, useCallback, useState, useEffect } from "react";
import styled from 'styled-components';
import { getCustomImageBlot, keyDownEvent, uploadImgSet, getFileName, getImgSize, createSrcSet } from '@/components/utils/reactQuillControl';
import ReactQuill, { Quill } from "react-quill";
import ImageResize from '@ammarkhalidfarooq/quill-image-resize-module-react-fix-for-mobile';
import QuillImageDropAndPaste from 'quill-image-drop-and-paste'
import imageCompression from 'browser-image-compression';
import { badWordCheck } from '@/components/utils/badWordCheck';

Quill.register('modules/imageDropAndPaste', QuillImageDropAndPaste);

const ImageFormat = Quill.import('formats/image');
const ImageBlot = getCustomImageBlot(ImageFormat, false, createSrcSet);
Quill.register(ImageBlot);
Quill.register("modules/imageResize", ImageResize);

const bold = Quill.import('formats/bold')
bold.tagName = 'B'
bold.className = 'ql-bold';
Quill.register(bold, true)

const italic = Quill.import('formats/italic')
italic.tagName = 'I'
italic.className = 'ql-italic';
Quill.register(italic, true)

export default function ReactQuillContainer({ content, className, readOnly, ...props }) {

  const quillRef = useRef();

  // ~ReactQuill 내용 데이터
  const [description, setDescription] = useState(content || "");


  useEffect(() => {
    setDescription(content)
    // 내용이 있는 경우 커서를 내용의 마지막으로 이동
    if (content) quillRef.current.getEditor().setSelection(content.length + 1);
  }, [content, props.type])

  // ~ReactQuill api에 올라간 이미지 이름들 데이터 - 게시글 수정시 자동으로 업데이트 될 예정
  const [uploadImgData, setUploadImgData] = useState([]);

  // ! 이미지 사이즈(용량) 컴파일 업로드 처리
  const imageCompressHandler = useCallback((file) => {
    const targetFile = file
    const targetType = String(targetFile.type)
    const ImageFormData = new FormData()

    // ! 업로드한 이미지 가로 세로 사이즈 정보 가져오기
    const imgSizeInfo = getImgSize(targetFile)
    console.log("업로드한 이미지 사이즈", imgSizeInfo)

    // 파일명 공백제거 및 10글자 이상일 경우 이름을 올린 날짜로 변경
    const fileName = getFileName(targetFile);

    if (targetType !== "image/gif") {
      // ! 업로드 파일이 gif 파일이 아닌 경우
      imageCompression(targetFile, { maxSizeMB: 9, useWebWorker: true, fileType: targetType }).then((res) => {
        const compressFile = new File([res], fileName, { type: targetType })
        ImageFormData.append("fileList", compressFile)
        console.log("사이즈 변환한 이미지 파일", compressFile)
        if (!badWordCheck(targetFile.name.replace(/ /g, ""))) {
          alert("파일 이름에 비속어가 포함되어 있어 업로드가 불가합니다.")
        } else {
          uploadImgSet(quillRef, ImageFormData, uploadImgData, setUploadImgData, imgSizeInfo); // 이미지 업로드 처리
        }
      }).catch((err) => {
        console.log(err);
      })
    } else {
      // ! 업로드 파일이 gif 파일인 경우 9MB 이하만 업로드
      if (targetFile.size <= 9000000) {
        if (!badWordCheck(targetFile.name.replace(/ /g, ""))) {
          alert("파일 이름에 비속어가 포함되어 있어 업로드가 불가합니다.")
        } else {
          ImageFormData.append("fileList", targetFile)
          uploadImgSet(quillRef, ImageFormData, uploadImgData, setUploadImgData, imgSizeInfo); // 이미지 업로드 처리
        }
      } else {
        alert("gif 파일은 9MB 이하만 업로드 가능합니다.")
      }
    }
  }, [uploadImgData, setUploadImgData, quillRef]);

  //! 드래그앤 드롭 이미지 업로드 처리
  const imageDragAndDrop = useCallback((imageDataUrl, type, imageData) => {
    const file = imageData.toFile();
    imageCompressHandler(file)
  }, [imageCompressHandler]);

  // ! 파입 업로드형 이미지 업로드 처리
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("id", "file-image");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.style.display = "none";
    input.click();

    input.addEventListener("change", () => {
      const file = input.files[0];
      imageCompressHandler(file)
    });
  }, [imageCompressHandler]);


  // ! 유투브 업로드 
  const videoHandler = useCallback(() => {

    // ! 유튜브, 비메오 url로 변경
    const getVideoUrl = (url) => {
      if (url === "" || url === null || (url !== null && url.includes("https://") === false)) {
        alert("유투브 링크를 입력해주세요.");
      } else {
        let match = url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/) ||
          url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/) ||
          url.match(/^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/);
        if (match && match[2] && match[2].length === 11) {
          return ('https') + '://www.youtube.com/embed/' + match[2] + '?showinfo=0';
        }
        if (match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/)) { // eslint-disable-line no-cond-assign
          return (match[1] || 'https') + '://player.vimeo.com/video/' + match[2] + '/';
        }
        return null;
      }
    }

    let url = prompt("유투브 영상 링크를 입력해주세요: ");
    url = getVideoUrl(url);

    if (url != null) {
      const editor = quillRef?.current.getEditor();
      const range = editor.getSelection();
      editor.insertEmbed(range.index, 'video', url);
      editor.setSelection(range.index + 1);
    }
  }, []);

  // ! Quill 내용 변경시
  const QuillChangeSet = async (quillRef) => {
    if (quillRef.current) {
      let quillHtml = quillRef.current.getEditor().root.innerHTML; // quill 내용
      setDescription(quillHtml)
    }
  }

  // ! 모듈 설정
  const modules = useMemo(() => {
    const modules = {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ size: [] }, { align: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" },],
          [{ color: ["#000000", "#e60000", "#ff9900", "#ffff00", "#008a00", "#0066cc", "#9933ff", "#ffffff", "#facccc", "#ffebcc", "#ffffcc", "#cce8cc", "#cce0f5", "#ebd6ff", "#bbbbbb", "#f06666", "#ffc266", "#ffff66", "#66b966", "#66a3e0", "#c285ff", "#888888", "#a10000", "#b26b00", "#b2b200", "#006100", "#0047b2", "#6b24b2", "#444444", "#5c0000", "#663d00", "#666600", "#003700", "#002966", "#3d1466", "custom-color",], }, { background: [] },],
          ["link", "image", "video"],
        ],
        handlers: {
          image: imageHandler,
          video: videoHandler,
        }
      },
      imageResize: {
        parchment: Quill.import("parchment"),
        displaySize: true,
        modules: ["Resize", "DisplaySize", "Toolbar"], //
        toolbarStyles: {
          position: 'absolute',
          top: '-12px',
          right: '0',
          left: '0',
          height: '0',
          minWidth: '100px',
          font: '12px/1.0 Arial, Helvetica, sans-serif',
          textAlign: 'center',
          color: '#333',
          boxSizing: 'border-box',
          cursor: 'default',
        },
      },
      imageDropAndPaste: {
        handler: imageDragAndDrop,
      },
      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      }
    };

    // 읿기 전용인 경우 이미지 업로드, 드래그앤 드롭 기능 제거
    readOnly && delete modules.imageResize;
    readOnly && delete modules.imageDropAndPaste;

    return modules;
  }, [imageDragAndDrop, imageHandler, videoHandler, readOnly]);





  return (
    <QuillStyleBox type={props.type}>
      <ReactQuill
        className={(className ? className : "") + (readOnly ? " ql-readOnly" : "")}
        theme="snow"
        ref={quillRef}
        placeholder="내용을 입력해주세요."
        defaultValue={description}
        modules={modules}
        formats={formats}
        onChange={() => QuillChangeSet(quillRef)}
        onKeyDown={(e) => keyDownEvent(e, quillRef)}
        readOnly={readOnly}
        autoFocus={content && content.length > 0 ? true : false}
        {...props}
      />
    </QuillStyleBox>
  );
}

const formats = ["header", "font", "size", "color", "bold", "italic", "underline", "strike", "blockquote",
  "list", "bullet", "indent", "link", "image", "align", "background", "video", "imageResize", "imageBlot"];

const QuillStyleBox = styled.div`

  .ql-container.ql-disabled .ql-tooltip, .ql-readOnly .ql-toolbar {
    display: none;
  }

  .ql-container.ql-disabled {
    border-bottom: 0;
  }

  .ql-readOnly .ql-container{
    border-radius: 0;
    border:none;
  }

  .ql-readOnly .ql-editor{
    padding: 20px 0;
  }

  .ql-container { 
    min-height: ${(props) => props.type === "comment" ? "auto" : "400px"};
    padding: 0;
    border-radius: 0 0 5px 5px; 
    font-family: var(--font-family-1); 
    position: relative;
  }

  .ql-bold {
  font-weight: bold;
  }

  .ql-italic {
    font-style: italic;
  }

  .ql-editor {
    padding: ${(props) => props.type === "comment" ? "0" : "15px"};
    height: 100%;
    position:relative;
    overflow:auto;
    white-space: pre-wrap;


    p { 
      display: block;
      width: 100%; 
    }

    .ql-align-justify:after { 
      content: ""; 
      display: inline-block; 
      width: 100%; 
    }

    ul,ol{
      padding-left: 0;
      li:not(.ql-direction-rtl)::before{
          text-align:left;
      }
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: bold;
  }

  iframe.ql-video {
    width: 100%;
    height: 56.25vw;
    max-height: calc(800px / 16 * 9);
  }
 
  .ql-toolbar { 
    border-radius: 5px 5px 0 0; 
    .ql-video {
      svg {
        display: none;
      }

      &:before {
        display: block;
        content: "";
        background-image: url("/images/icons/youtube.svg");
        background-size: 100% auto;
        background-repeat: no-repeat;
        width:18px;
        height:18px;
      }
    }
  }

`