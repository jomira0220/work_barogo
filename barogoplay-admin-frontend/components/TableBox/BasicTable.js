import {
  Table as ReactTable,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';

import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { PostIcon, TrashCanIcon } from "@/components/Icon/Icon";
import styles from "./TableBox.module.scss";

import Button from "@/components/Button/Button";
import PaginationBox from "@/components/Pagination/PaginationBox";
import SelectBox from "@/components/SelectBox/SelectBox";
import Modal from "@/components/Modal/Modal";
import SaveMemberList from "@/components/SaveMemberList";
import ProduceInfoView from "@/components/TableBox/ProduceInfoView";
import NumberTableFilter from "@/components/TableBox/NumberTableFilter";
import { Filter } from "@/components/Filter/Filter";

import Link from "next/link";
import Image from "next/image";

import { FilterDataSet } from "@/components/utils/FilterDataSet";
import { queryString } from "@/components/utils/queryString";
import {
  DetailTableItem, SaveMemberListDelete,
  countSelect, viewItemCount, filterStringSelectOption,
  AllCheckHandler, ItemCheckHandler, SearchKeywordSet, SearchTypeSet,
  PageSizeControl
} from "@/components/TableBox/tableControl";
import { TextOverflow } from "@/components/utils/TextOverflow";
import { separatePage } from "@/components/utils/separatePage";
import { stringKrChange } from "@/components/utils/stringKrChange";

export default function BasicTable(props) {
  const router = useRouter();
  const {
    data, filterCategory, filterListSet, filterSearchSet,
    checkOnOff, itemDetail, addButton,
  } = props;

  //! filterSearchSet - 검색 샐렉트 박스 리스트
  //! data:realData - 나중에 api 연결할 진짜 데이터로 setData로 넣어주고
  //! makeData(100)은 테스트용 가짜 데이터
  //! filterCategory - 테이블 카테고리
  //! filterTableSet - 테이블 칼럼 리스트
  //! defaultViewCount - 테이블 페이지 기본 사이즈 지정
  //! checkOnOff - 테이블 체크박스 온오프
  //! itemDetail - 테이블 리스트 클릭시 상세 페이지로 이동할지 여부
  //! downOnOff - 테이블 위에 csv, excel 다운로드 버튼 온오프


  const [TableData, setTableData] = useState([]);

  //! 테이블 필터 항목 아이템 리스트
  const [filterTotalData, setFilterTotalData] = useState(FilterDataSet(filterCategory, router.query))

  useEffect(() => {
    // 테이블에 노출할 데이터 설정
    const arrCheck = Array.isArray(data)
      ? data.length > 0
      : Object.keys(data).length > 0

    // 저장된 회원리스트의 경우 데이터를 그대로 셋팅
    filterCategory === "saveMemberListDetail"
      ? setTableData(data)
      : setTableData(arrCheck ? data.content : []);
  }, [data, filterCategory]);


  // ! 테이블 칼럼 리스트 이미지나 링크가 있으면 아이콘 혹은 이미지로 노출
  const columnHelper = createColumnHelper();

  // ! 테이블 헤더 항목 리스트
  let filterTableSet = TableData.length > 0 ? TableData.filter((item, index) => index === 0).map((item) => {
    return Object.keys(item)
  })[0] : [];

  // !저장된 회원리스트는 삭제 버튼 들어가는 테이블 추가
  if (filterCategory === "saveMemberList") {
    filterTableSet.push("remove")
  }


  // ! 테이블 칼럼 리스트 설정
  const tableColumnSet = filterTableSet.map((item, index) => {
    return columnHelper.accessor(item, {
      header: () => stringKrChange[item] || stringKrChange[filterCategory][item],
      footer: (props) => props.column.id,
      cell: (props) => {
        const itemValue = props.row.original[item]
        return (
          <>
            {itemValue !== null && itemValue !== undefined ? (
              itemValue === props.row.original["link"] // 링크가 있으면 아이콘링크로 추가
                ? <Link href={itemValue || "#"}><PostIcon /></Link>
                : (itemValue === props.row.original["imageUrl"] || item.includes("ImageUrl") || item.includes("image") && itemValue.includes("http")) // 이미지가 있으면 이미지로 추가
                  ? <Image className={styles.tableImg} src={itemValue || "/images/logo.png"} width={100} height={100} alt="이미지" priority />
                  : typeof itemValue === "number" && item !== "userCode" && item !== "id" && item !== "userId" && item.includes("id")// 숫자면 콤마 추가
                    ? itemValue.toLocaleString("ko-kr")
                    : String(itemValue) === ""
                      ? "내용없음"
                      : typeof itemValue === "object" && !Array.isArray(itemValue)
                        ? (
                          <div className={styles.infoTable}>
                            <ProduceInfoView
                              itemValue={itemValue}
                              stringKrChange={stringKrChange}
                              filterCategory={filterCategory}
                            />
                          </div>
                        )
                        : stringKrChange[itemValue]
                          ? stringKrChange[itemValue]
                          : item.includes("At")
                            ? itemValue.slice(2, 8).replace(/\B(?<!\.\d*)(?=(\d{2})+(?!\d))/g, ".") // 템플릿에서 날짜 형태면 앞 8자리만 노출
                            : item.includes("Date") ? itemValue.replace(/-/g, ".") : TextOverflow(String(itemValue), 30)
            ) : item === "remove" ? (
              <Button variantStyle="white" sizeStyle="xs" onClick={() => { SaveMemberListDelete(props.row.original["id"], router) }}><span className="blind">회원리스트 삭제</span><TrashCanIcon /></Button>
            ) : "null"
            }
          </>
        )
      },
      size: 60
    })
  })


  //! 테이블 체크 박스 선택시
  const [CheckBox, setCheckBox] = useState({ [filterCategory]: [] })

  useEffect(() => {
    if (CheckBox[filterCategory] && typeof window !== "undefined") {
      if (filterCategory === "blockMemberList") { // 차단 관리에서 체크박스 선택시 별도 처리
        const blockListData = { COMMUNITY: [], NICKNAME: [] }
        // 차단하는 타입이 커뮤니티인지 닉네임인지 구분하여 속성값으로 추가
        document.querySelector(`.${filterCategory}_TableTop .listCheckBtn`).setAttribute("data-communityblocklist", JSON.stringify(blockListData.COMMUNITY))
        document.querySelector(`.${filterCategory}_TableTop .listCheckBtn`).setAttribute("data-nicknameblocklist", JSON.stringify(blockListData.NICKNAME))
      } else {
        document.querySelectorAll(`.${filterCategory}_TableTop .listCheckBtn`).forEach((item) => {
          item.setAttribute("data-checklist", CheckBox[filterCategory])
        })
      }

      if (filterCategory === "saveMemberListDetail") {
        // 저장된 회원리스트 상세 페이지에서 체크박스로 삭제할 회원 선택시 노출할 박스 생성 - 삭제할 회원 목록 박스
        const checkListBox = document.querySelector('.checkListBox')
        if (checkListBox) {
          checkListBox.innerHTML = '<h5>삭제할 회원 목록</h5><div class="tableBox"><table><thead></thead></table></div>'
          const checkListTable = checkListBox.querySelector('table')
          const idData = TableData.filter((item) => CheckBox[filterCategory].includes(String(item.id)))
          if (idData.length > 0) {
            const tableHeader = Object.keys(idData[0])
            const tableBody = idData.map((item) => Object.values(item))
            if (tableHeader.length > 0 && tableBody.length > 0) {
              tableHeader.map((item, index) => {
                const th = document.createElement("th")
                th.textContent = stringKrChange[filterCategory][item]
                checkListTable.querySelector("thead").appendChild(th)
              })
              tableBody.map((item) => {
                const tr = document.createElement("tr")
                item.map((item2) => {
                  const td = document.createElement("td")
                  td.innerHTML = `<span>${item2}</span>`
                  tr.appendChild(td)
                })
                checkListTable.appendChild(tr)
              })
            }
          } else {
            checkListBox.innerHTML = ""
          }
        }
      }
    }
  }, [CheckBox, filterCategory, TableData])


  const columns = useMemo(
    () => {
      // ! 체크박스 설정이 true면 체크박스 컬럼 추가
      checkOnOff && (
        tableColumnSet.unshift({
          id: 'select',
          header: ({ table }) => {
            // 현재 노출중인 테이블 ID 리스트 (*선물 관리의 경우 id가 templateTraceId임)
            const tableIdLIst = TableData.map((item) => String(filterCategory === "giftTemplate" ? item.templateTraceId : item.id))
            // 현재 노출중인 테이블 ID 리스트와 체크한 ID 리스트가 일치하는지 확인하여 전체 체크박스 체크 여부 확인 
            const checkIdList = CheckBox[filterCategory].filter(item => tableIdLIst.includes(item))
            return (
              <input
                type='checkbox'
                name="page_check_all"
                onChange={() => AllCheckHandler(filterCategory, CheckBox, setCheckBox)}
                checked={checkIdList.length === tableIdLIst.length ? true : false}
              />
            )
          },
          cell: ({ row }) => {
            // 체크한 아이디 확인 변수 (*선물하기 템플릿의 경우 템플릿 아이디로 체크박스 생성)
            const checkId = filterCategory === "giftTemplate"
              ? row.original.orderTemplateStatus === "EXPIRED" ? "EXPIRED" : row.original.templateTraceId // 만료된 선물 템플릿은 ID 값을 EXPIRED로 변경
              : row.original.id
            return (
              <input
                type='checkbox'
                name={`check_${checkId}`}
                onChange={() => ItemCheckHandler(filterCategory, CheckBox, setCheckBox, checkId, TableData)}
                checked={CheckBox[filterCategory].includes(String(checkId)) ? true : false}
              />
            )
          }
        })
      )
      return tableColumnSet
    },
    [tableColumnSet, checkOnOff, filterCategory, CheckBox, setCheckBox, TableData]
  );

  const table = useReactTable({
    data: TableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  useEffect(() => {
    table.setPageSize(Number(router.query.size) || data.size || 10);
    table.setPageIndex(Number(router.query.page) || 0);
  }, [router.query.size, router.query.page, table, data.size]);


  //! 체크한 회원리스트에 저장하기 모달 - 저장된 회원리스트 팝업 노출용
  const [MemberListSaveModal, setMemberListSaveModal] = useState(false)

  //! 검색 결과 저장 모달 노출시 저장할 회원리스트가 100개 이상인 경우 노출
  const [alertModal, setAlertModal] = useState(false)


  //! 필터 변경 여부 확인용
  const [filterChangeCheck, setFilterChangeCheck] = useState(false)

  //! 멤버리스트 페이지의 숫자 범위 입력 형태 필터 이름 리스트 
  const memberListNumberFilterName = [
    "totalPoint", "seasonPoint", "badgeCount", "challengeCount",
    "friendCount", "postCount", "commentCount", "loginCount"
  ]

  // !검색 타입이 없는 검색 filterCategory 리스트와 검색 기준 데이터 키값
  const differentSearchType = { pointManagement: "userId", messageSendingHistory: "notificationId" }


  //! 검색 버튼 클릭시 셋팅한 조건으로 쿼리 생성하여 페이지 새로고침 & 데이터 노출 처리
  const FilterDataSearch = () => {

    // 커뮤니티 페이지에서 검색시 좋아요수 데이터 추가
    if (filterCategory === "communityPost") {
      const likeCountValue = document.querySelector("[name='likeCountUpper']").value
      if (likeCountValue !== 0) {
        filterTotalData.likeCountUpper = Number(likeCountValue)
      }
    }

    // 검색키워드 값 확인
    const searchKeywordEl = document.querySelector("[name^='searchType_']");
    const searchType = searchKeywordEl.name === "searchType_all" ? "all" : searchKeywordEl.name.slice(11, searchKeywordEl.name.length);
    const searchKeyword = searchKeywordEl.value;

    // 검색키워드 및 타입 추가 
    if (!Object.keys(differentSearchType).includes(filterCategory)) {
      if (searchKeyword !== "") {
        filterTotalData.searchKeyword = searchKeyword
        filterTotalData.searchType = searchType
      } else {
        delete filterTotalData.searchType
        delete filterTotalData.searchKeyword
      }
    } else {
      // differentSearchType안의 필터카테고리들은 
      // 검색 타입이 없는 검색이므로 검색 타입은 제외하고 검색키워드를 데이터 항목명으로 값 추가
      // 예시) filterTotalData.userId = searchKeyword
      filterTotalData[differentSearchType[filterCategory]] = searchKeyword
    }

    // 숫자로 된 필터 항목별로 시작값과 끝값 항목명을 배열로 생성
    const NumberFilterArr = []
    memberListNumberFilterName.forEach((item) => { NumberFilterArr.push(item + "Start"), NumberFilterArr.push(item + "End") })

    // 날짜 혹은 숫자 입력 형태로 되어있는 필터 항목 리스트 (날짜들의 경우 filterSetItem에 있는 항목명임)
    const checkList = ["inStartDate", "inEndDate", "lastLoginStartDate", "lastLoginEndDate", ...NumberFilterArr]
    // 날짜 혹은 숫자 입력 형태로 되어있는 필터 항목들의 값을 확인하여 해당 항목명으로 필터 토탈 데이터에 반영
    checkList.map((item, index) => {
      const el = document.querySelector(`[name="${item}"]`)
      if (el && el.value !== "") {
        filterTotalData[item] = item.includes("Date") ? new Date(el.value).toISOString().slice(0, 10) : Number(el.value)
      }
    })


    // filterTotalData에 추가된 항목들의 값이 0이거나 ""면 제외 처리
    Object.keys(filterTotalData).filter(item => filterTotalData[item] === 0 || filterTotalData[item] === "").forEach((item) => {
      delete filterTotalData[item]
    })

    // 필터가 변경되었다는 멘트 표시 안보이게 처리용
    setFilterChangeCheck(false)
    console.log("검색 필터 조건 값 확인", filterTotalData)

    // 필터 조건 값에 따른 쿼리 변경 처리
    router.push(router.pathname + "?" + queryString(filterTotalData))
  }

  //! 검색 박스 생성 여부 조건 확인 
  // BasicTable 컴포넌트에서 filterSearchSet 속성의 값이 배열이면 true, 아니면 false
  const filterSearchSetCheck = typeof filterSearchSet === "object" ? true : false

  //! 검색 셀렉트 타입 선택 (""면 전체 검색, "userId"면 userId 검색)
  const [selectSearchType, setSelectSearchType] = useState(filterSearchSetCheck && filterSearchSet.length === 1 ? filterSearchSet[0] : "all")


  //! 회원리스트에 저장 버튼 클릭시
  const SaveMemberListSet = (e) => {
    if (CheckBox[filterCategory].length === 0) return alert("선택된 회원이 없습니다.")
    setMemberListSaveModal(true) // 저장된 회원리스트 팝업 노출
  }



  return (
    <>
      {filterListSet && (
        <div className={styles.filterWarp}>
          {filterListSet && (
            <div className={styles.selectFilter}>
              {filterListSet.map((item, index) => {
                return (
                  <Filter
                    key={index}
                    filterTotalData={filterTotalData}
                    filterTitleSet={item}
                    filterCategory={filterCategory}
                    setFilterTotalData={setFilterTotalData}
                    setFilterChangeCheck={setFilterChangeCheck}
                  />
                )
              })}
            </div>
          )}

          {/* 회원 관리에서만 노출 - 숫자 범위 입력 형태 필터 */}
          {filterCategory === "memberList" && (
            <div className={styles.numberFilter}>
              {memberListNumberFilterName.map((item, index) => {
                return (
                  <NumberTableFilter
                    key={index}
                    name={item}
                    filterCategory={filterCategory}
                    filterTotalData={filterTotalData}
                    setFilterChangeCheck={setFilterChangeCheck}
                    query={router.query}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}

      {filterChangeCheck && (
        <p className={styles.filterChange}>
          필터 조건이 변경되었습니다. 검색을 눌러주세요
        </p>
      )}

      <div className={styles.tableTop + ` ${filterCategory}_TableTop`}>
        {filterSearchSetCheck && filterSearchSet.length > 0 &&
          <div className={styles.searchWrap}>
            {filterSearchSetCheck && filterSearchSet.length > 1 && (
              <SelectBox
                className={styles.itemCountSelect}
                options={filterStringSelectOption(filterSearchSet, filterCategory, stringKrChange)}
                onChange={(e) => setSelectSearchType(e.value)}
                defaultValue={SearchTypeSet(router, filterStringSelectOption(filterSearchSet, filterCategory, stringKrChange))}
              />
            )}

            <input
              className={styles.filterInput} type='text'
              name={`searchType_${selectSearchType}`}
              placeholder={filterSearchSet.length === 1 ? stringKrChange[filterCategory][filterSearchSet[0]] + " 검색" : "검색키워드"}
              defaultValue={SearchKeywordSet(router, differentSearchType, filterCategory)}
            />

            <Button variantStyle="color" sizeStyle="sm" onClick={() => FilterDataSearch()}>검색</Button>
            {filterCategory === "memberList" && (
              // 회원리스트 메뉴에서만 저장된 회원리스트에 저장하기 버튼 노출
              <Button variantStyle="color" sizeStyle="sm" onClick={() => SaveMemberListSet()}>회원리스트에 저장</Button>
            )}
          </div>
        }

        {addButton && (
          // 상단에 추가할 버튼이 있는 경우 추가 노출 처리용
          <div className={styles.addButton}>
            {filterChangeCheck
              ? <b className={styles.infoText}>검색을 완료한 후에 목록 다운로드가 가능합니다.</b>
              : addButton}
          </div>
        )}
      </div>

      {data && data.size && (
        <div className={styles.tableCountTop}>
          <p>
            총 페이지 : {(data?.totalPages || 0).toLocaleString("ko-kr")}개 / 검색 결과 :{" "}
            {(data?.totalElements || 0).toLocaleString("ko-kr")}개
            {checkOnOff && (
              <>{" / "}<span>{checkOnOff && CheckBox[filterCategory].length}개 선택</span></>
            )}
          </p>
          {/* 몇개씩 보기 페이지 사이즈 선택 박스 */}
          <SelectBox
            className={styles.itemCountSelect}
            onChange={(e) => PageSizeControl(Number(e.value), "size", filterCategory, router, separatePage)}
            options={viewItemCount}
            defaultValue={countSelect(data.size)}
          />
        </div>
      )}

      {data && TableData.length > 0 ? (
        <div className={styles.tableBox + " " + filterCategory}>
          <div className={styles.tableBoxInner}>
            <table className={(filterCategory ? filterCategory : null) + (checkOnOff ? " " + styles.checkBoxStyle : null)}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <th
                          key={header.id}
                          colSpan={header.colSpan}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.isPlaceholder ? null : (
                            <span className={styles.titleNSort}>
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{ asc: <FaSortUp />, desc: <FaSortDown />, }[header.column.getIsSorted()]}
                              {header.column.getCanSort() && !header.column.getIsSorted() ? <FaSort /> : null}
                            </span>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getSortedRowModel().rows.map((row) => {
                  return (
                    <tr key={row.id} className={itemDetail && styles.cursor}>
                      {row.getVisibleCells().map((cell, index) => {
                        return (
                          <td
                            key={cell.id}
                            onClick={(e) => itemDetail && DetailTableItem(e, router, cell, stringKrChange, filterCategory)}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {data && data.totalElements && (
            <div className={styles.pageBox}>
              <PaginationBox
                filterCategory={filterCategory}
                activePage={data.number + 1}
                itemsCountPerPage={data.size}
                totalItemsCount={data.totalElements}
                pageRangeDisplayed={5}
              />

              <span className={styles.pageNumInput} style={{ float: "right" }}>
                페이지 번호 이동 : {" "}
                <input
                  type="number"
                  name='tablePageNumInput'
                  onChange={(e) => PageSizeControl(Number(e.target.value) - 1, "page", filterCategory, router, separatePage)}
                  min={1}
                  max={data?.totalPages}
                  value={data.number + 1}
                />
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.noData}><p>데이터가 없습니다.</p></div>
      )}

      {/* 저장된 회원리스트 팝업 */}
      {MemberListSaveModal && (
        <SaveMemberList checkList={CheckBox[filterCategory]} setMemberListSaveModal={setMemberListSaveModal} />
      )}

      {alertModal && (
        <Modal type="alert" className={styles.alertPop} closePotable={() => setSaveModal(false)}>
          <h3>회원리스트는 최대 100건만<br />저장 가능합니다.</h3>
          <p>저장된 회원리스트에서 불필요한<br /> 리스트를 삭제해주세요.</p>
          <Button variantStyle="color" sizeStyle="lg" onClick={() => setAlertModal(false)}>확인</Button>
        </Modal>
      )}

    </>
  );

}




