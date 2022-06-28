import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import styles from '../../styles/Input.module.css'
import {Add as AddIcon, Remove as RemoveIcon} from '@material-ui/icons'

function Input({max=10000000000000,stepValue=0.01,defaultValue=1, prefix="?", align="left", suffix=null, onValueChange=() => null, onFocus=() => null}, ref) {

    const [value, setValue] = useState(defaultValue)
    const inputRef = useRef(null)

    useImperativeHandle(ref, () => ({
        value,
        setValue
    }))

    useEffect(() => {

        onValueChange(defaultValue)

        return () => {
            setValue(defaultValue)
        }
    }, [])

    useEffect(() => {
        setValue(current => {
            if(current > max) {
                return max
            }
            return current
        })
    }, [max])

    const handleFormatNumber = (number, dec, dsep, tsep) => {
        if (isNaN(number) || number == null) return '';
      
        number = parseFloat(number).toFixed(~~dec);
        tsep = typeof tsep == 'string' ? tsep : ',';
      
        var parts = number.split('.'),
          fnums = parts[0],
          decimals = parts[1] ? (dsep || '.') + parts[1] : '';
      
        return fnums.replace(/(\d)(?=(?:\d{3})+$)/g, '$1' + tsep) + decimals;
    }

    const handleRepresentationValue = (number) => {
        let baseValue = number
        let s = 'Mil'
        if(number >= 1000 && number < 1000000) {
            baseValue /= 1000
        } else if(number >= 1000000 && number < 1000000000) {
            baseValue /= 1000000
            s = baseValue > 1 ? 'Milhões' : 'Milhão'
        } else if(number >= 1000000000 && number < 1000000000000) {
            baseValue /= 1000000000
            s = baseValue > 1 ? 'Bilhões' : 'Bilhão'
        } else if(number >= 1000000000000 && number < 1000000000000000) {
            baseValue /= 1000000000000
            s = baseValue > 1 ? 'Trilhões' : 'Trilhão'
        } else if(number >= 1000000000000000 &&  number <= 9999999999999999) {
            baseValue /= 1000000000000000
            s = baseValue > 1 ? 'Quadrilhões' : 'Quadrilhão'
        } else {
            return ''
        }

        return `- ${baseValue.toFixed(2)} ${s} de ${suffix || prefix}`
    }

    const handleChange = (e) => {
        const valueMasked = e.target.value.length === 0 ? "0" : e.target.value
        const bruteValue = parseFloat(valueMasked.replaceAll('.', "").replaceAll(',', ''))/100
        if(bruteValue > max) {
            e.preventDefault()
            return
        }
        if(bruteValue !== value) {
            onValueChange(bruteValue)
        }

        setValue(isNaN(bruteValue) ? 0 : bruteValue)
    };

    const handleStepAdd = () => {
        if(value + stepValue <= max) {
            onValueChange(value + stepValue, true)
        }
        setValue(current => current + stepValue > max ? current : current + stepValue)
    }

    const handleStepRemove = () => {
        if(value - stepValue >= 0) {
            onValueChange(value - stepValue, true)
        }
        setValue(current => current - stepValue < 0 ? current : current - stepValue)
    }

    return (
        <div className={styles.content} onClick={() => {inputRef.current?.focus()}}>
            <div style={align === 'left' ? {left: 16} : {right: 16}} className={styles.steps}>
                {align === 'left' ? (
                    <>
                        <button disabled={(value+stepValue) > 100000000000000} onClick={handleStepAdd}><AddIcon style={{width: 16, height: 16}} /></button>
                        <button disabled={(value-stepValue) < 0} onClick={handleStepRemove}><RemoveIcon style={{width: 16, height: 16}} /></button>
                    </>
                ) : (
                    <>
                        <button disabled={(value-stepValue) < 0} onClick={handleStepRemove}><RemoveIcon style={{width: 16, height: 16}} /></button>
                        <button disabled={(value+stepValue) > 100000000000000} onClick={handleStepAdd}><AddIcon style={{width: 16, height: 16}} /></button>
                    </>
                )}
            </div>
            <div className={styles.col}>
                <span className={styles.prefix}>{prefix}</span>
                <span className={styles.divide}></span>
                <input ref={inputRef} onFocus={onFocus} className={styles.input} value={handleFormatNumber(value, 2, ',', '.')} type="text" onChange={handleChange} />
            </div>
            <div className={styles.col}>
                <span className={styles.brutevalue}>{value >= 1000 ? value.toFixed(2) : `${value.toFixed(2)} ${suffix || prefix}`} {handleRepresentationValue(value)}</span>
            </div>
        </div>
    )
}

export default forwardRef(Input)