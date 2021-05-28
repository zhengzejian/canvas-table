import config from '../config'
import { TAnyFunction, State, UnionColumnNode } from '../types'

let isDivideLineDragging: boolean = false
let activeNode: UnionColumnNode
let minX = 0, translateX = 0, isMoved = false

export function addDivideLineEvent(el: HTMLElement, state: State): void {
    let { totalHeight, wrapperPosition } = state
    let { lineColor } = config
    let { left: wrapperLeft } = wrapperPosition
    let divideLineMove = (e: MouseEvent) => {
        isMoved = true
        let { clientX } = e
        let offsetX = clientX - wrapperLeft
        translateX = offsetX < minX ? minX : offsetX
        el.style.left = `${translateX}px`

    }
    el.addEventListener('mousedown', (e: MouseEvent) => {
        isDivideLineDragging = true
        let { xLeft, width } = activeNode.data
        minX = xLeft + 30
        el.style.height = `${totalHeight}px`
        el.style.backgroundColor = `${lineColor}`
        document.addEventListener('mousemove', divideLineMove)
    })
    document.addEventListener('mouseup', (e: MouseEvent) => {
        isDivideLineDragging = false
        el.style.backgroundColor = `transparent`
        el.style.display = 'none'
        if (isMoved) {
            console.log('translateX: ', translateX)
            let { xLeft } = activeNode.data
            activeNode.data.width = translateX - xLeft
            activeNode.data.xRight = translateX
            activeNode.after(node => {
                let { xRight } = node.prev!.data
                node.data.xLeft = xRight
                node.data.xRight = xRight + node.data.width
                console.log(node)
            })
            console.log('state: ', state)
            isMoved = false
        }
        document.removeEventListener('mousemove', divideLineMove)
    })
}

type Coordinate = [number, number]

export function handleShowDivideLine(el: HTMLElement, state: State): TAnyFunction {
    let { columnLinkList } = state
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
        let node = columnLinkList.find((node) => {
            let { xRight } = node.data
            return x > xRight - DIS && x < xRight + DIS
        })
        if (node !== undefined) {
            activeNode = node
            el.style.left = `${node.data.xRight - 1}px`
            el.style.display = 'block'
        } else if (!isHide) {
            el.style.display = 'none'
        }
    }
}