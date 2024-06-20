export interface FormWarpProps {
  children: React.ReactNode;
  [props: string]: any;
}

export interface StyleBoxProps {
  children: React.ReactNode;
  styletype: string;
  title?: string;
  [props: string]: any;
}

export interface SentDateProps {
  title?: string;
  info?: string;
  [props: string]: any;
}

export interface SentTargetProps {
  FileView: any;
  setFileView: any;
  limitCount: number;
  readOnly: boolean;
}

export interface SentContentProps {
  title?: string;
  limitCount?: number;
  maxLength?: number;
  placeholder?: string;
  defaultValue?: string;
  inputInfo?: string;
  [props: string]: any;
}

export interface SentInputProps {
  title?: string;
  styletype?: string;
  className?: string;
  inputInfo?: string;
  [props: string]: any;
}
