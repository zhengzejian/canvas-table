import config from '../config'
import { textOverflow } from '../utils'
import { State } from '../types'

export function initCanvas(canvasEle: HTMLCanvasElement, canvasCtx: CanvasRenderingContext2D): void {
    let devicePixelRatio = window.devicePixelRatio
    let { width, height } = config

    canvasEle.width = width * devicePixelRatio
    canvasEle.height = height * devicePixelRatio
    canvasEle.style.width = `${width}px`
    canvasEle.style.height = `${height}px`
    canvasCtx.scale(devicePixelRatio, devicePixelRatio)
}

export function paintCanvas(state: State): void {
    state.canvasCtx!.beginPath()
    state.canvasCtx!.clearRect(-1, -1, 2000, 2000)
    let { unionData } = state
    paintHeader(state)
    if (unionData.length) {
        paintBody(state)
    }

}

// draw header
function paintHeader(state: State): void {

    let { width, headerHeight, headerColor, cellPaddingWidth, font, lineColor } = config
    let canvasCtx = state.canvasCtx as CanvasRenderingContext2D
    let { columnLinkList } = state
    let totalWidth = columnLinkList.tail!.data.xRight
    let canvasWidth = totalWidth > width ? width : totalWidth

    canvasCtx.beginPath()
    canvasCtx.lineWidth = 1
    canvasCtx.fillStyle = headerColor
    canvasCtx.fillRect(0.5, 0.5, canvasWidth, headerHeight)

    canvasCtx.strokeStyle = lineColor
    canvasCtx.strokeRect(0.5, 0.5, canvasWidth, headerHeight)

    columnLinkList.traverse(node => {
        let { xLeft, label, width } = node.data
        let textY = (13 + headerHeight) / 2
        let text = textOverflow(state, label, width).text
        canvasCtx.beginPath()
        canvasCtx.lineWidth = 1
        canvasCtx.strokeStyle = lineColor
        canvasCtx.moveTo(xLeft, 0)
        canvasCtx.lineTo(xLeft, headerHeight)
        canvasCtx.stroke()

        canvasCtx.beginPath()
        canvasCtx.font = `${font}`
        canvasCtx.fillStyle = '#000'
        canvasCtx.fillText(text, xLeft + cellPaddingWidth, textY)
    })
}

function paintBody(state: State): void {
    let canvasCtx = state.canvasCtx as CanvasRenderingContext2D
    let { unionData, columnLinkList, totalHeight } = state
    let totalWidth = columnLinkList.tail!.data.xRight
    let { rowHeight, headerHeight, height, lineColor, font, cellPaddingWidth } = config
    let bodyHeight: number = height - headerHeight
    let dataHeight: number = unionData.length * rowHeight
    let actualHeight: number = dataHeight > bodyHeight ? bodyHeight : dataHeight

    canvasCtx.beginPath()
    canvasCtx.strokeStyle = lineColor
    canvasCtx.strokeRect(0 + 0.5, headerHeight, totalWidth, actualHeight - 0.5)

    unionData.forEach((item, i) => {
        canvasCtx.beginPath()
        canvasCtx.strokeStyle = lineColor
        canvasCtx.moveTo(0, item.y)
        canvasCtx.lineTo(totalWidth, item.y)
        canvasCtx.stroke()


        columnLinkList.traverse(node => {
            let { key, xLeft, width } = node.data
            let { text } = textOverflow(state, item[key], width)
            // draw vertical line
            canvasCtx.beginPath()
            canvasCtx.strokeStyle = lineColor
            canvasCtx.moveTo(xLeft, 0)
            canvasCtx.lineTo(xLeft, totalHeight)
            canvasCtx.stroke()
            // draw text
            canvasCtx.beginPath()
            canvasCtx.font = `${font}`
            canvasCtx.fillText(text, xLeft + cellPaddingWidth, item.y - 7)
        })
    })
}