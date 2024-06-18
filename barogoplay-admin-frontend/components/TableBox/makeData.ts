import { fakerKO as faker } from "@faker-js/faker";

export type Person = {
  riderCode: string;
  brand: string;
  nickname: string;
  hubId: string;
  riderId: string;
  hubAddress1: string;
  hubAddress2: string;
  riderStatus: string;
  joinDate: Date | number | string;
  lastLogin: Date | number | string;
  level: string;
  pushCode: string;
  sentTime: Date | number | string;
  fractionation: string;
  sentSubject: string;
  sentContent: string;
  sentTargetCount: number;
  writer: string;
  sentResult: string;
  confirmedCount: number;
  messageCode: string;
  confirmationStatus: string;
  templateId: string;
  templateName: string;
  templateBrand: string;
  sentCloseTime: string;
  sentAvailableCount: number;
  productName: string;
  giftGenerationTime: string;
  giftReservationTime: string;
  giftId: string;
  userHP: string;
  blockingCode: string;
  blockingCount: number;
  blockingTime: string;
  handlers: string;
  blockingContentLink: string;
  badgeCode: string;
  badgeName: string;
  badgeDescription: string;
  badgeCountingPeriod: string;
  badgeCountingItems: string;
  appliedBrand: string;
  selectedAreas: string;
  modifiedTime: string;
  createTime: string;
  modifiedUser: string;
  riderAffiliation: string;
  badgeCounting: number;
  badgeAchievementStatus: string;
  challengeCode: string;
  challengeName: string;
  challengeDescription: string;
  challengePeriodType: string;
  challengeCountingItems: string;
  seasonPoint: number;
  totalPoint: number;
  boardCode: string;
  boardKind: string;
  boardTitle?: string;
  boardContent?: string;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  authorCode?: string;
  authornickname?: string;
  writeDate?: string;
  modifyDate?: string;
  hiddenState?: string;
  showReservationTime?: string;
  hashTag?: string;
  adminBoardKind?: string;
  eventThumbnail?: string;
  boardState?: string;
  commentContent?: string;
  commentReplyCount?: number;
  reportCode?: string;
  reportType?: string;
  reporterAccountCode?: string;
  reporternickname?: string;
  reportDate?: string;
  hiddenDate?: string;
  hidingHandler?: string;
  advertisingPostCode?: string;
  advertisingPosition?: string;
  advertisingImage?: string;
  advertisingTitle?: string;
  advertisingClickCount?: number;
  advertisingStartDate?: string;
  advertisingEndDate?: string;
  achievedBadgeCount: number;
  achievedChallengeCount: number;
  accountCode: string;
  friendCount: number;
  writeBoardCount: number;
  writeCommentCount: number;
  cumulativeVisits: number;
  challengeAchievementStatus: string;
  getPointDate?: string;
  getPointRoute?: string;
  getPoint?: number;
};

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = (): Person => {
  return {
    riderCode: "P" + faker.number.int(9999),
    brand: ["바로고", "딜버", "모아라인"][faker.number.int(2)],
    nickname: faker.person.firstName() + "라이더",
    hubId: "B" + faker.number.int(9999),
    riderId: "W" + faker.number.int(9999),
    hubAddress1: faker.location.city(),
    hubAddress2: faker.location.city(),
    riderStatus: ["차단", "활성"][faker.number.int(1)],
    joinDate: faker.date.past().toISOString().split("T")[0],
    lastLogin: faker.date.future().toISOString().split("T")[0],
    level: ["D3", "D2", "D1", "C1", "C2"][faker.number.int(4)],
    pushCode: "PSH" + faker.number.int(200),
    sentTime:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0],
    fractionation: ["메세지", "포인트", "렌딩"][faker.number.int(1)],
    sentSubject: faker.lorem.sentence(),
    sentContent: faker.lorem.sentence(),
    sentTargetCount: faker.number.int(9999),
    writer: ["barogo", "dealver", "moa"][faker.number.int(2)] + "admin",
    sentResult: ["성공", "실패"][faker.number.int(1)],
    confirmedCount: faker.number.int(9999),
    messageCode: "PSH" + faker.number.int(200),
    confirmationStatus: ["확인", "미확인"][faker.number.int(1)],
    templateId: String(faker.number.int(9999999)),
    templateName: faker.lorem.sentence(),
    templateBrand: ["스타벅스", "커피빈", "파리바게트"][faker.number.int(2)],
    productName: faker.commerce.productName(),
    sentCloseTime: faker.date
      .past()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "."),
    sentAvailableCount: faker.number.int(9999),
    giftGenerationTime:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0],
    giftReservationTime:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0],
    giftId: String(faker.number.int(9999999)),
    userHP: String(faker.phone.number()),
    blockingCode: ["A", "B", "C"][faker.number.int(2)],
    blockingCount: faker.number.int(10),
    blockingTime:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0],
    handlers: ["barogo", "dealver", "moa"][faker.number.int(2)] + "admin",
    blockingContentLink: faker.internet.url(),
    badgeCode: "BDG" + faker.number.int(9999),
    badgeName: "배지명" + faker.number.int(99),
    badgeDescription: faker.lorem.sentence(),
    badgeCountingPeriod:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " ~ " +
      faker.date.past().toISOString().split("T")[0].replace(/-/g, "."),
    badgeCountingItems: ["수행건수", "근무일", "연속근무일"][
      faker.number.int(2)
    ],
    appliedBrand: "바로고,딜버,모아라인",
    selectedAreas: ["서울,인천", "인천,강원", "부산"][faker.number.int(2)],
    modifiedTime:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0],
    createTime:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0],
    modifiedUser: ["barogo", "dealver", "moa"][faker.number.int(2)] + "admin",
    riderAffiliation: ["바로고", "딜버", "모아라인"][faker.number.int(2)],
    badgeCounting: faker.number.int(50),
    badgeAchievementStatus: ["달성", "미달성", "진행중"][faker.number.int(2)],
    challengeCode: "CLG" + faker.number.int(9999),
    challengeName: "챌린지명" + faker.number.int(99),
    challengeDescription: faker.lorem.sentence(),
    challengePeriodType: ["일간", "주간", "월간"][faker.number.int(2)],
    challengeCountingItems: ["수행건수", "근무일", "연속근무일"][
      faker.number.int(2)
    ],
    seasonPoint: faker.number.int(9999),
    totalPoint: faker.number.int(9999),
    boardCode: "DOC" + faker.number.int(9999),
    boardKind: ["자유", "활동인증", "중고거래"][faker.number.int(2)],
    boardTitle: faker.lorem.sentence(),
    boardContent: faker.lorem.sentence(),
    likeCount: faker.number.int(9999),
    commentCount: faker.number.int(9999),
    viewCount: faker.number.int(9999),
    authorCode: "P" + faker.number.int(9999),
    authornickname: faker.person.firstName() + "라이더",
    writeDate:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0].slice(0, -3),
    modifyDate:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0].slice(0, -3),
    hiddenState: ["공개", "숨김"][faker.number.int(1)],
    showReservationTime:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0].slice(0, -3),
    hashTag:
      ["#해시태그", "#해시태그2", "#해시태그3"][faker.number.int(2)] +
      " " +
      ["#해시태그", "#해시태그2", "#해시태그3"][faker.number.int(2)],
    adminBoardKind: ["이벤트", "제휴혜택", "뉴스/공지"][faker.number.int(2)],
    eventThumbnail: "https://via.placeholder.com/200X100",
    boardState: ["A", "B"][faker.number.int(1)],
    commentContent: faker.lorem.sentence(),
    commentReplyCount: faker.number.int(9999),
    reportCode: "RPT" + faker.number.int(9999),
    reportType: ["A", "B", "C"][faker.number.int(2)],
    reporterAccountCode: "P" + faker.number.int(9999),
    reporternickname: faker.person.firstName() + "라이더",
    reportDate:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0].slice(0, -3),
    hiddenDate:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0].slice(0, -3),
    hidingHandler: ["barogo", "dealver", "moa"][faker.number.int(2)] + "admin",
    advertisingPostCode: "MKT" + faker.number.int(9999),
    advertisingPosition: ["큰", "작은", "중간"][faker.number.int(2)],
    advertisingImage: "https://via.placeholder.com/200X100",
    advertisingTitle: faker.lorem.sentence(),
    advertisingClickCount: faker.number.int(9999),
    advertisingStartDate:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0].slice(0, -3),
    advertisingEndDate:
      faker.date.past().toISOString().split("T")[0].replace(/-/g, ".") +
      " " +
      faker.date.past().toISOString().split("T")[1].split(".")[0].slice(0, -3),
    accountCode: String(faker.number.int(9999)),
    achievedBadgeCount: faker.number.int(9999),
    achievedChallengeCount: faker.number.int(9999),
    friendCount: faker.number.int(9999),
    writeBoardCount: faker.number.int(9999),
    writeCommentCount: faker.number.int(9999),
    cumulativeVisits: faker.number.int(9999),
    challengeAchievementStatus: ["달성", "미달성", "진행중"][
      faker.number.int(2)
    ],
    getPointDate: faker.date
      .past()
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "."),
    getPointRoute: ["배지", "챌린지", "광고", "이벤트", "소셜"][
      faker.number.int(4)
    ],
    getPoint: faker.number.int(9999),
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!;
    return range(len).map((d): Person => {
      return {
        ...newPerson(),
      };
    });
  };

  return makeDataLevel();
}
