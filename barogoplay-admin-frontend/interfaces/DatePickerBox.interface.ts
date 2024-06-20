export interface DatePickerBoxProps {
  selected?: Date;
  onChange?: (date: Date) => void;
  dateFormat?: string;
  name?: string;
  children?: React.ReactNode;
  minDate?: Date;
  maxDate?: Date;
}

export interface ExampleCustomTimeInputProps {
  date: Date;
  value: Date;
  // onChange?: (value: string) => void;
}

export interface ExampleCustomInputProps {
  value?: string;
  onClick?: () => void;
  date: Date;
  name: string;
}
