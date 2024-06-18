import { useRouter } from "next/router";
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";
import styles from "./SearchBox.module.scss";

export default function SearchBox(props) {

  const { searchPopup, setSearchPopup, pageName, pageType, totalElements } = props;

  const router = useRouter();

  // 검색 조건
  const SelectOption = [
    { value: "titleOrContent", name: "제목 + 내용" },
    { value: "title", name: "제목" },
    { value: "content", name: "내용" },
    { value: "nickname", name: "닉네임" },
    { value: "hashtag", name: "해시태그" },
  ];

  const SelectBox = (props) => {
    return (
      <select>
        {props.option.map((option, index) => {
          return (
            <option
              key={index}
              value={option.value}
              defaultValue={props.defaultValue === option.value}
            >
              {option.name}
            </option>
          );
        })}
      </select>
    );
  };

  // 검색 클릭시
  const SearchHandler = () => {
    const searchType = document.querySelector("select").value;
    const searchKeyword = document.querySelector("input").value;
    const eventBoard = ["event", "benefit", "news"]
    if (eventBoard.includes(pageName)) {
      router.push(
        `/event/${pageName}/${pageType ? "ON" : "OFF"}?searchType=${searchType}&searchKeyword=${searchKeyword}&page=0`
      );
    } else {
      router.push(
        `/board/${pageName === "hot" ? "free" : pageName
        }?searchType=${searchType}&searchKeyword=${searchKeyword}&page=0`
      );
    }

    setSearchPopup(false);
  };

  return (
    <>
      {searchPopup && (
        <Modal closePortal={() => setSearchPopup(false)}>
          <div className={styles.boardSearchBox}>
            <h5>게시글 검색</h5>
            <SelectBox option={SelectOption} defaultValue="titleOrContent" />
            <input type="text" placeholder="검색 내용 입력"></input>
          </div>
          <div className={styles.searchButtonBox}>
            <Button
              variantStyle="gray"
              sizeStyle="lg"
              onClick={() => setSearchPopup(false)}
            >
              닫기
            </Button>
            <Button
              variantStyle="color"
              sizeStyle="lg"
              onClick={() => SearchHandler()}
            >
              검색
            </Button>
          </div>
        </Modal>
      )}
      {/* 검색 결과인 경우 검색 조회 결과수 노출 */}
      {router.query.searchType && (
        <div className={styles.searchHeader}>
          <p>
            {router.query.searchType === "titleOrContent"
              ? [
                "제목 혹은 내용에 ",
                <b key={0}>{router.query.searchKeyword}</b>,
                "가 포함된",
              ]
              : router.query.searchType === "title"
                ? [
                  "제목에 ",
                  <b key={1}>{router.query.searchKeyword}</b>,
                  "가 포함된",
                ]
                : router.query.searchType === "content"
                  ? [
                    "내용에 ",
                    <b key={2}>{router.query.searchKeyword}</b>,
                    "가 포함된",
                  ]
                  : router.query.searchType === "nickname"
                    ? ["닉네임이 ", <b key={3}>{router.query.searchKeyword}</b>, "인"]
                    : router.query.searchType === "hashtag"
                      ? [
                        "해시태그가",
                        <b key={4}>{router.query.searchKeyword}</b>,
                        "인",
                      ]
                      : null}{" "}
            <br /> 게시글에 대한 검색결과 입니다.{" "}
          </p>
          <span className={styles.searchCount}>
            {Number(totalElements).toLocaleString("ko-kr")}건
          </span>
        </div>
      )}
    </>
  )
}