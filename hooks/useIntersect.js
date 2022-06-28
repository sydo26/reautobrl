import { useEffect, useRef, useState } from "react"

export const useMultipleIntersects = (threshold=0, callback=() => null) => {
    const [intersects, setIntersects] = useState([])

    const observer = useRef(null)

    const addIntersect = (node) => {
        setIntersects(current => [...current, node])
    }

    const cleanIntersects = () => {
        if(observer.current !== null) {
            intersects.forEach(node => observer.current.unobserve(node))
            observer.current.disconnect()
            observer.current = null
        }
        setIntersects([])
    }

    useEffect(() => {
        if(!observer.current) {
            observer.current = new IntersectionObserver((entries) => entries.forEach(item => callback(item)), {
                threshold
            })
        }

        intersects.forEach(node => observer.current.observe(node))
        
    }, [intersects])


    return { addIntersect, cleanIntersects }

}