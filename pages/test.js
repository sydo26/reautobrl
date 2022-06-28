import { useEffect } from "react"
import { useMultipleIntersects } from "../hooks"

export default function Test() {

    const { addIntersect, cleanIntersects } = useMultipleIntersects(0, (item) => {
        console.log(item.target.textContent)
    })

    useEffect(() => {
        [...document.querySelectorAll('.c1')].forEach(element => addIntersect(element))
        return () => {
            cleanIntersects()
        }
    }, [])

    return <div style={{width: '100%', height: 'auto'}}>
        <div style={{width: '100%', height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red'}}
        className="c1">Teste 1</div>
        <div style={{width: '100%', height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue'}}
        className="c1">Teste 2</div>
        <div style={{width: '100%', height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'green'}}
        className="c1">Teste 3</div>
        <div style={{width: '100%', height: 500, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'orange'}}
        className="c1">Teste 4</div>

    </div>
}