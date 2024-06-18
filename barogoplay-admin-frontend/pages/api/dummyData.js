
const giftTemplate = {
  "5595227": {
    templateName: "1월 1일 새해 선물",
    templateID: "1234567",
    brand: "스타벅스",
    productName: "아이스 아메리카노",
    ProductPrice: "4500원",
    itemType: "교환권",
    sentStartTime: "2023.12.01",
    sentCloseTime: "2024.03.31",
    templateState: "alive",
    sentLimitCount: "500",
    sentPossibleCount: "500",
    PreShippedCount: "0",
  }
}

export default function handler(req, res) {
  res.status(200).json()
}
