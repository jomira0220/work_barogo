import styles from './TextBox.module.scss'

export default function TextBox(props) {
    const { id, title = '', placeholder = '',
        children, defaultValue, type = "text", onChange, name, readOnly } = props

    return (
        <label className={styles.textBox}>
            {
                title !== "" ?
                    <div className={styles.title}>{title}</div>
                    : null
            }
            {
                children !== undefined ?
                    <div className={styles.inputButtonSet}>
                        <input
                            id={id}
                            type={type}
                            placeholder={placeholder}
                            defaultValue={defaultValue}
                            onChange={(e) => onChange && onChange(e)}
                            name={name}
                            readOnly={readOnly ? true : false}
                        />
                        {children}
                    </div>
                    : <input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        defaultValue={defaultValue}
                        onChange={(e) => onChange && onChange(e)}
                        name={name}
                        readOnly={readOnly ? readOnly : false}
                    />
            }
        </label>
    )
}


