export interface BoardPostDetailProps {
  isLogin: boolean;
  detailBoardName: string;
  detailData: any;
  commentDataProps: any;
  voteData: any;
  hashTagData: any;
  commentPage: number;
}

export interface userStatusObj {
  [key: string]: string;
}

export interface UserBlockBtn {
  (
    targetType: string,
    targetId: number,
    userId: number,
    userStatus: string,
    detailBoardName: string
  ): void;
}

export interface blockPopup {
  onoff: boolean;
  userId: number;
  targetId: number;
  targetType: string;
}

export interface userStatus {
  [key: string]: string;
}

export interface boardKoName {
  [key: string]: string | boardString[string];
}

export interface boardString {
  [key: string]: string;
}

export interface commentData {
  content: any;
  totalElements: number;
  number: number;
  size: number;
}
