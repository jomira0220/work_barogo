import { useRef, useEffect, useState } from 'react';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';
import styles from './TagInputBox.module.scss';

export default function TagInputBox({ tagData }) {

  const inputRef = useRef();

  useEffect(() => {
    const inputEl = document.getElementById('tags');
    if (inputEl) {
      const tagify = new Tagify(inputEl, {
        delimiters: " |#", // add new tags when a comma or a space is entered
        originalInputValueFormat: valuesArr => valuesArr.map(item => item.value).join(','),
        maxTags: 10,
        trim: true,
        validate: function (value) {
          // 입력된 값이 특수문자를 포함하고 있는지 확인하여
          // 특수문자가 포함되어 있지 않은 경우에만 태그를 유효하게 합니다.
          var specialCharRegex = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gim
          const hasSpecialChar = specialCharRegex.test(value.value);
          return !hasSpecialChar;
        }
      });
    }
  }, [inputRef]);


  // 태그 입력받는 state
  const [tags, setTags] = useState(tagData.join(" "));
  const handleChange = (e) => {
    const value = e.target.value;
    const arrValue = value.includes(" ")
      ? value.split(" ")
      : value !== ""
        ? [value]
        : [];
    setTags(arrValue);
  };

  return (
    <div className={`${styles.tagInputBox}`}>
      <input
        ref={inputRef}
        id="tags"
        className={styles.tagInput}
        name="tags"
        placeholder="태그를 입력해주세요."
        defaultValue={tags}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
};


