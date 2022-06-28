import React, { memo, useEffect, useState } from 'react'
import { Link as LinkIcon } from '@material-ui/icons'
import styles from '../../styles/Card.module.css'

function Card({title="", children, align="left"}) {

    const [width, setWidth] = useState(null)
    const [id, setId] = useState('')

    useEffect(() => {

        setId(title.replaceAll(' ', '-').toLowerCase())
        setWidth(window.innerWidth)

        window.addEventListener('resize', () => {
            setWidth(window.innerWidth)
        })

        return () => {
            setId('')
            setWidth(0)
        }
    }, [])


    return <div id={id} className={styles.content + " " + styles[`content_${align}`]}>
        {align === 'left' || (width && width < 888) ? (
            <>
            <div className={styles.col}>
                <div style={{justifyContent: 'flex-start'}} className={styles.title}>
                    <a href={`#${id}`}><LinkIcon style={{width: 24, height: 24, color: '#E0E0E0'}}/></a>
                    <span>{title}</span>
                </div>
            </div>
            <div className={styles.col}>
                <div className={styles.children}>
                {children}
                </div>
            </div>
            </>
        ) : (
            <>
            <div className={styles.col}>
                <div className={styles.children}>
                {children}
                </div>
            </div>
            <div className={styles.col}>
                <div style={{justifyContent: 'flex-end'}} className={styles.title}>
                    <span>{title}</span>
                    <a href={`#${id}`}><LinkIcon style={{width: 24, height: 24, color: '#E0E0E0'}}/></a>
                </div>
            </div>
            </>
        )}
    </div>
}

export default memo(Card)