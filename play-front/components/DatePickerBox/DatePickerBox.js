import DatePicker from "react-datepicker";
import ko from "date-fns/locale/ko";
import "react-datepicker/dist/react-datepicker.css";
import { useState, forwardRef } from "react";
import styles from "./DatePickerBox.module.scss";
import styled from "styled-components";
import { CalendarIcon, LineBasicArrow } from "@/components/Icon/Icon";
import { getMonth, getYear } from "date-fns";

const StyledDatePickerWrapper = styled.div`
  position: relative;

  .react-datepicker-popper{
    z-index: 50;
  }

  .custom-header {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: var(--space-1) 0 var(--space-2);
  }
  .react-datepicker__header--custom {
    border-bottom: none;
    background-color: var(--white-color-1);
    border-radius: var(--space-1);
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
    padding: var(--space-1) var(--space-5) var(--space-1) var(--space-2);
    border-radius: var(--space-1);
    border-color: var(--gray-color-2);
    text-align: left;
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
`;

export default function DatePickerBox({ onChange, dateFormat, ...props }) {

  const [startDate, setStartDate] = useState(props.selected || new Date());
  // console.log("startDate", startDate, props.selected)
  const ExampleCustomInput = forwardRef(({ value, onClick, date, name }, ref) => (
    <button className={styles.datePickerCustomInput} onClick={onClick} ref={ref}>
      {value}<CalendarIcon />
      <input type="hidden" value={new Date(date).toISOString()} name={name} />
    </button>
  ));
  ExampleCustomInput.displayName = "ExampleCustomInput";

  const _ = require("lodash");
  const years = _.range(2000, getYear(new Date()) + 2, 1)
  //_.range(2023, 2100, 1);
  const months = Array.from({ length: 12 }, (v, i) => i + 1).map((month) => `${month}`);
  // console.log(months, "months")

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
              onClick={() => decreaseMonth()}
              disabled={prevMonthButtonDisabled}
            >
              <LineBasicArrow direction="left" color="var(--gray-color-1)" />
            </button>
            <div className="select-area">
              <select
                value={getYear(date)}
                onChange={({ target: { value } }) => {
                  changeYear(value);
                }}
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}년
                  </option>
                ))}
              </select>

              <select
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) => {
                  changeMonth(months.indexOf(value));
                }}
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
              <LineBasicArrow color="var(--gray-color-1)" />
            </button>
          </div>
        )}
        {...props}
        dateFormat={dateFormat || "M월 d일"}
        // shouldCloseOnSelect={false} // 날짜 선택시 달력 닫히지 않도록 설정
        locale={ko}
        selected={startDate}
        onChange={(date) => { setStartDate(date); onChange && onChange(date); }}
        customInput={<ExampleCustomInput date={startDate} name={props.name} />}
        popperPlacement="auto"
      />{props.children}
    </StyledDatePickerWrapper>
  );
}