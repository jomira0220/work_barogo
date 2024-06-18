
// 기본 날짜가 없는 경우 어제 날짜를 리턴
export default function getReportDate(lastDate) {
    if (lastDate !== undefined && lastDate !== null && lastDate !== "") {
        return lastDate;
    }
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const year = d.getFullYear();
    const month = ("0" + (1 + d.getMonth())).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    return year + "-" + month + "-" + day;
}