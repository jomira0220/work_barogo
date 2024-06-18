import dynamic from 'next/dynamic'

const Select = dynamic(
  () => import('react-select'),
  { ssr: false }
)

import { useState } from 'react';
export default function SelectBox({ className, options, styles, onChange, defaultValue, ...props }) {
  const [selectedOption, setSelectedOption] = useState(defaultValue || options[0]);
  return (
    // style={{ position: "relative", minWidth: "120px" }}
    <div>
      <Select
        options={options}
        styles={styles}
        className={(className !== undefined ? ` ${className}` : ``)}
        defaultValue={selectedOption}
        onChange={(e) => { onChange && onChange(e); setSelectedOption(e) }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 5,
          colors: {
            ...theme.colors,
            primary25: '#f5f5f5',
            primary: '#000',
          },
        })}
        {...props}
      // {... (props.onChange ? { onChange: (e) => { setSelectedOption(e); console.log(e) } } : {})}
      >
      </Select>
      <input style={{ opacity: "0", width: "1px", height: "1px", position: 'absolute', top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} defaultValue={selectedOption.value !== "" ? selectedOption.value : ""} required={props.required} />
    </div>
  );
}