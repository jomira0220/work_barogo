import { forwardRef, useState } from "react";
import DatePicker from "react-datepicker";
import ko from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./DatePickerBox.module.scss";
import styled from "styled-components";
import { getMonth, getYear } from "date-fns";
import { CalendarIcon, LineBasicArrow } from "@/components/Icon/Icon";
import {
  DatePickerBoxProps,
  ExampleCustomTimeInputProps,
  ExampleCustomInputProps,
} from "@/interfaces";

const StyledDatePickerWrapper = styled.div`
  position: relative;
  .custom-header {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: var(--space-1) 0 var(--space-2);
  }
  .react-datepicker__header--custom {
    border-bottom: none;
    background-color: var(--white-color-1);
  }
  .react-datepicker,
  .react-datepicker__day,
  .react-datepicker__time-list-item,
  .custom-header {
    font-family: var(--font-family);
  }
  .react-datepicker__day--selected,
  .react-datepicker__day--in-selecting-range,
  .react-datepicker__day--in-range,
  .react-datepicker__month-text--selected,
  .react-datepicker__month-text--in-selecting-range,
  .react-datepicker__month-text--in-range,
  .react-datepicker__quarter-text--selected,
  .react-datepicker__quarter-text--in-selecting-range,
  .react-datepicker__quarter-text--in-range,
  .react-datepicker__year-text--selected,
  .react-datepicker__year-text--in-selecting-range,
  .react-datepicker__year-text--in-range {
    background-color: var(--play-color-1);
    border-radius: 50%;
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected {
    background-color: var(--play-color-1);
  }
  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .react-datepicker__day {
    font-weight: 500;
  }
  .select-area {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-weight: bold;
  }
  .select-area select {
    font-family: var(--font-family);
  }
  .react-datepicker__day-name {
    color: var(--gray-color-1);
  }
  .react-datepicker__input-time-container {
    margin: 0;
    padding: var(--space-1) var(--space-2);
    font-weight: bold;
    border-top: 1px solid var(--gray-color-2);
  }
  .react-datepicker__day--keyboard-selected,
  .react-datepicker__month-text--keyboard-selected,
  .react-datepicker__quarter-text--keyboard-selected,
  .react-datepicker__year-text--keyboard-selected {
    background-color: var(--gray-color-2);
  }

  .react-datepicker-popper {
    z-index: 10;
  }
`;

export default function DatePickerBox({
  onChange,
  dateFormat,
  ...props
}: DatePickerBoxProps) {
  const [startDate, setStartDate] = useState<Date>(
    props.selected || new Date()
  );
  const ExampleCustomInput = forwardRef(
    ({ value, onClick, date, name }: ExampleCustomInputProps, ref: any) => (
      <button
        className={styles.datePickerCustomInput}
        onClick={onClick}
        ref={ref}
      >
        {value}
        <CalendarIcon />
        <input type="hidden" value={new Date(date).toISOString()} name={name} />
      </button>
    )
  );
  ExampleCustomInput.displayName = "ExampleCustomInput";

  const _ = require("lodash");
  const years = _.range(2000, getYear(new Date()) + 2, 1);
  const months = Array.from({ length: 12 }, (item, index) => String(index + 1));

  const ExampleCustomTimeInput = ({
    date,
    value,
  }: // onChange,
  ExampleCustomTimeInputProps) => (
    <input
      id={styles.timeInput}
      type="time"
      value={String(value)}
      onChange={(e) => e.target.value}
      style={{ border: "solid 1px pink" }}
    />
  );

  return (
    <StyledDatePickerWrapper>
      <DatePicker
        renderCustomHeader={({
          date,
          changeYear,
          changeMonth,
          decreaseMonth,
          increaseMonth,
          prevMonthButtonDisabled,
          nextMonthButtonDisabled,
        }) => (
          <div className="custom-header">
            <button
              onClick={() => {
                decreaseMonth();
              }}
              disabled={prevMonthButtonDisabled}
            >
              <LineBasicArrow direction="left" color="var(--gray-color-1)" />
            </button>
            <div className="select-area">
              <select
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(Number(value))}
              >
                {years.map((option: number) => (
                  <option key={option} value={option}>
                    {option}년
                  </option>
                ))}
              </select>

              <select
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {option}월
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => increaseMonth()}
              disabled={nextMonthButtonDisabled}
            >
              <LineBasicArrow direction="right" color="var(--gray-color-1)" />
            </button>
          </div>
        )}
        {...props}
        dateFormat={dateFormat || "yyyy.MM.dd"}
        shouldCloseOnSelect={false} // 날짜 선택시 달력 닫히지 않도록 설정
        locale={ko} // 한국어 설정
        selected={startDate}
        onChange={(date) => {
          setStartDate(date as Date);
          onChange && onChange(date as Date);
        }}
        customInput={
          <ExampleCustomInput
            date={startDate}
            name={props.name === undefined ? "" : props.name}
          />
        }
        customTimeInput={
          <ExampleCustomTimeInput date={startDate} value={startDate} />
        }
      />
      {props.children}
    </StyledDatePickerWrapper>
  );
}
