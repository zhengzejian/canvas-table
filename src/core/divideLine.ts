import config from '../config'
import { TAnyFunction, State } from '../types'

let isDivideLineDragging: boolean = false

export function addDivideLineEvent(el: HTMLElement, state: State): void {
    let { totalHeight, unionColumn } = state
    let { lineColor } = config
    let divideLineMove = (e: MouseEvent) => {
        console.log(e.offsetX, e.offsetY)
    }
    el.addEventListener('mousedown', () => {
        isDivideLineDragging = true
        el.style.height = `${totalHeight}px`
        el.style.backgroundColor = `${lineColor}`
        el.style.display = 'block'
        document.addEventListener('mousemove', divideLineMove)
    })
    document.addEventListener('mouseup', (e: MouseEvent) => {
        isDivideLineDragging = false
        el.style.backgroundColor = `transparent`
        el.style.display = 'none'
        document.removeEventListener('mousemove', divideLineMove)
    })
}

type Coordinate = [number, number]

export function handleShowDivideLine(el: HTMLElement, state: State): TAnyFunction {
    let { unionColumn } = state
    return function (coordinate: Coordinate): void {
        if (isDivideLineDragging) return
        let [x, y] = coordinate
        let { headerHeight } = config
        let rangeArr = unionColumn.map(item => item.x + item.width)
        const DIS = 2
        for (let i = 0, j = rangeArr.length; i < j; i++) {
            if (y <= headerHeight && (x > (rangeArr[i] - DIS) && x < (rangeArr[i] + DIS))) {
                el.style.left = `${rangeArr[i] - 1}px`
                el.style.display = 'block'
                break
            } else {
                el.style.display = 'none'
            }
        }
    }


}