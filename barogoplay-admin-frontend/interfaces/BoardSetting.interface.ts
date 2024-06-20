export interface SettingBtnProps {
  className: string;
  isLogin: string;
  type: string;
  SetSettingModalOpen: (value: boolean) => void;
  SettingModalOpen: boolean;
  itemData: { id: number; isMine: boolean };
  SetModalConChange: (value: string) => void;
  SetCommentSettingOpen: (value: string) => void;
}

export interface CommentLikeBtnProps {
  className: string;
  isLogin: string;
  item: {
    id: number;
    isLiked: boolean;
    likeCount: number;
  };
  SetSettingModalOpen: (value: boolean) => void;
  SettingModalOpen: boolean;
  boardName: string;
  boardId: number;
  commentPage: number;
  setCommentData: (value: any) => void;
}

export interface CommentBtnProps {
  className: string;
  isLogin: string;
  targetId: number | null;
  commentData: any;
  SetSettingModalOpen: (value: boolean) => void;
  SettingModalOpen: boolean;
  CommentSettingOpen: { onoff: boolean; content: string };
  SetCommentSettingOpen: (value: { onoff: boolean; content: string }) => void;
  ModalConChange: { type: string; targetId: number };
  SetModalConChange: (value: { type: string; targetId: number }) => void;
}

export interface LikeBtnProps {
  className: string;
  style: object;
  isLogin: string;
  boardName: string;
  likeData: { isLiked: boolean; likeCount: number };
  setLikeData: (value: { isLiked: boolean; likeCount: number }) => void;
  boardId: number;
  SetSettingModalOpen: (value: boolean) => void;
  SettingModalOpen: boolean;
}

export interface CommentSubmitBtnProps {
  className: string;
  commentPage: number;
  TargetCommentId: number | null;
  detailBoardName: string;
  detailDataId: number;
  CommentSettingOpen: { onoff: boolean; content: string };
  setCommentData: (value: any) => void;
  SetCommentSettingOpen: (value: { onoff: boolean; content: string }) => void;
}

export interface CommentEditBtnProps {
  targetId: number;
  commentData: any;
  SetCommentSettingOpen: (value: { onoff: boolean; content: string }) => void;
}

export interface CommentDelBtnProps {
  targetId: number;
  detailBoardName: string;
  detailDataId: number;
  commentPage: number;
  setCommentData: (value: any) => void;
}

export interface MyPostDeleteBtnProps {
  detailBoardName: string;
  targetId: number;
  router: any;
  isHot: boolean;
}

export interface MyPostEditBtnProps {
  detailBoardName: string;
  targetId: number;
  router: any;
  isHot: boolean;
}
