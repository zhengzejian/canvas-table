import config from '../config'
import { TAnyFunction, State, UnionColumnNode } from '../types'

let isDivideLineDragging: boolean = false
let activeNode: UnionColumnNode
let minX = 0

export function addDivideLineEvent(el: HTMLElement, state: State): void {
    let { totalHeight, unionColumn } = state
    let { lineColor } = config
    let divideLineMove = (e: MouseEvent) => {
        let { clientX } = e
        console.log('offsetX: ', clientX, e.target)
        let { x, width } = activeNode.data
        // let currentX = x + width
        let translateX = clientX < minX + 28 ? minX + 28 : clientX
        // console.log('translateX: ', translateX)
        el.style.left = `${translateX}px`
        activeNode.data.width = translateX - x
    }
    el.addEventListener('mousedown', () => {
        console.log('activeNode: ', activeNode)
        isDivideLineDragging = true
        let { x, width } = activeNode.prev!.data
        minX = width + x
        el.style.height = `${totalHeight}px`
        el.style.backgroundColor = `${lineColor}`
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
    let { unionColumn, columnLinkList } = state
    return function (coordinate: Coordinate): void {
        let [x, y] = coordinate
        let { headerHeight } = config
        if (isDivideLineDragging) return

        let isHide = el.style.display === 'none'
        if (y >= headerHeight) {
            !isHide && (el.style.display = 'none')
            return
        }

        const DIS = 2
        let offsetX = 0
        let node = columnLinkList.find((node) => {
            let { x: columnX, width } = node.data
            offsetX = columnX + width
            return x > offsetX - DIS && x < offsetX + DIS
        })
        if (node !== undefined) {
            activeNode = node
            el.style.left = `${offsetX - 1}px`
            el.style.display = 'block'
        } else if (!isHide) {
            el.style.display = 'none'
        }






        // let rangeArr = unionColumn.map(item => item.x + item.width)
        // for (let i = 0, j = rangeArr.length; i < j; i++) {
        //     if (y <= headerHeight && (x > (rangeArr[i] - DIS) && x < (rangeArr[i] + DIS))) {
        //         el.style.left = `${rangeArr[i] - 1}px`
        //         el.style.display = 'block'
        //         break
        //     } else {
        //         el.style.display = 'none'
        //     }
        // }
    }


}