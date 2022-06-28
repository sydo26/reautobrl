import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import styles from '../../styles/Checkbox.module.css'


function Checkbox({title="", defaultChecked=false, onChange=() => null}, ref) {

    const [checked, setChecked] = useState(defaultChecked)

    useImperativeHandle(ref, () => ({
        checked,
        setChecked
    }))

    useEffect(() => {
        return () => {
            setChecked(defaultChecked)
        }
    }, [])

    useEffect(() => {
        onChange(checked)
    }, [checked])

    const handlePress = () => {
        setChecked(current => !current)
    }

    return (
        <div className={styles.content} onClick={handlePress}>
            <div className={checked ? styles.trigger : styles.trigger + " " + styles.no_checked}></div>
            <span>{title}</span>
        </div>
    )
}

export default forwardRef(Checkbox)