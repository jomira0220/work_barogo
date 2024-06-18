export const resizable = function (resizer) {
  const direction = resizer.getAttribute("data-direction") || "horizontal";
  const prevSibling = resizer.previousElementSibling;
  const nextSibling = resizer.nextElementSibling;

  //  마우스의 위치값 저장을 위해 선언
  let x = 0;
  let y = 0;
  let prevSiblingHeight = 0;
  let prevSiblingWidth = 0;

  // resizer에 마우스 이벤트가 발생하면 실행하는 Handler
  const mouseDownHandler = function (e) {
    // 마우스 위치값을 가져와 x, y에 할당
    x = e.clientX;
    y = e.clientY;
    // 대상 Element에 위치 정보를 가져옴
    const rect = prevSibling.getBoundingClientRect();
    // 기존 높이와 너비를 각각 할당함
    prevSiblingHeight = rect.height;
    prevSiblingWidth = rect.width;

    // 마우스 이동과 해제 이벤트를 등록
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    // 마우스가 움직이면 기존 초기 마우스 위치에서 현재 위치값과의 차이를 계산
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    // 이동 방향에 따라서 별도 동작
    // 기본 동작은 동일하게 기존 크기에 마우스 드래그 거리를 더한 뒤 상위요소(container)를 이용해 퍼센티지를 구함
    // 계산 대상이 x 또는 y인지에 차이가 있음
    switch (direction) {
      case "vertical":
        const h =
          ((prevSiblingHeight + dy) * 100) /
          resizer.parentNode.getBoundingClientRect().height;
        prevSibling.style.height = `${h}%`;
        break;
      case "horizontal":
      default:
        const w =
          ((prevSiblingWidth + dx) * 100) /
          resizer.parentNode.getBoundingClientRect().width;
        prevSibling.style.width = `${w}%`;
        break;
    }

    // 크기 조절 중 마우스 커서를 변경함
    // class="resizer"에 적용하면 위치가 변경되면서 커서가 해제되기 때문에 body에 적용
    const cursor = direction === "horizontal" ? "col-resize" : "row-resize";
    resizer.style.cursor = cursor;
    document.body.style.cursor = cursor;

    prevSibling.style.userSelect = "none";
    prevSibling.style.pointerEvents = "none";

    nextSibling.style.userSelect = "none";
    nextSibling.style.pointerEvents = "none";
  };

  const mouseUpHandler = function () {
    // 모든 커서 관련 사항은 마우스 이동이 끝나면 제거됨
    resizer.style.removeProperty("cursor");
    document.body.style.removeProperty("cursor");

    prevSibling.style.removeProperty("user-select");
    prevSibling.style.removeProperty("pointer-events");

    nextSibling.style.removeProperty("user-select");
    nextSibling.style.removeProperty("pointer-events");

    // 등록한 마우스 이벤트를 제거
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  // 마우스 down 이벤트를 등록
  resizer.addEventListener("mousedown", mouseDownHandler);
};

// // 모든 resizer에 만들어진 resizable을 적용
// document.querySelectorAll(".resizer").forEach(function (ele) {
//   resizable(ele);
// });