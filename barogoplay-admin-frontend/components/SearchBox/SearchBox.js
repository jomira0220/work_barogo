import styles from './SearchBox.module.scss'
import Button from '@/components/Button/Button'
import { useState } from 'react'

export default function SearchBox(props) {
  const { onClick, placeholder, buttonText, className } = props;
  const [searchText, setSearchText] = useState("")
  return (
    <div className={styles.searchBox + (className ? ' ' + className : '')}>
      <input
        type="search"
        name='tableSearchBox'
        defaultValue={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder={placeholder || '검색어를 입력하세요'}
      />
      <Button
        variantStyle="color"
        sizeStyle="sm"
        onClick={() => onClick(searchText)}>
        {buttonText || "검색"}
      </Button>
    </div>
  )
}