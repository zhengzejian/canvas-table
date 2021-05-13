import config from '../config'
import { TAnyFunction, State } from '../types'

export function addDivideLineEvent(el: HTMLElement, totalHeight: number): void {
    let { lineColor } = config
    el.addEventListener('mousedown', () => {
        el.style.height = `${totalHeight}px`
        el.style.backgroundColor = `${lineColor}`
        el.style.display = 'block'
    })
    el.addEventListener('mouseup', function (e: MouseEvent) {
        el.style.backgroundColor = `transparent`
        el.style.display = 'none'
    })
}

type Coordinate = [number, number]

export function handleShowDivideLine(el: HTMLElement, state: State): TAnyFunction {
    let { unionColumn } = state
    return function (coordinate: Coordinate) {
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