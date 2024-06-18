
export const LinkingCloseSet = () => {
  const prevPath = JSON.parse(sessionStorage.getItem("prevPath"));
  const pathSearch = prevPath.filter((path) =>
    path.includes("/user/") === false
    || path.includes("/user/myPage") === true
    || path.includes("/user/accountManagement") === true
  )[0]
  location.href = pathSearch;
}