import { FilterSet } from "@/components/Filter/FilterSet";
// 필터 아이템 데이터 기본 배열 생성 처리용 함수
export const FilterNewArray = (listSet) => {
  // listSet : 필터항목배열 ["brand", "hubAddress1", "riderStatus", "joinDate", "lastLogin", "conditionItem]
  // console.log("listSet", listSet)
  const array = new Object();
  listSet.map((item) => {
    return (
      array[item] =
      FilterSet(item)[0].filterSetItem[0].title === "전체" && FilterSet(item)[0].filterType === "일반"
        ? (// 전체가 기본 선택값인 경우 - 전체를 제외한 나머지 값만 배열로 생성
          FilterSet(item)[0].filterSetItem.map((item) => {
            if (item.title !== "전체") return item.value;
          }).splice(1)
        )
        : (
          FilterSet(item)[0].filterSetItem[0].title
            ? FilterSet(item)[0].filterSetItem[0].value
            : [FilterSet(item)[0].filterSetItem[0]] // 날짜 선택의 경우
        )
    );
  });
  return array;
};
