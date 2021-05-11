import config from '../config'
import { textOverflow } from '../utils'
import { State } from '../types'

export function paint(state: State): void {
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
    let { totalWidth, unionColumn } = state
    let canvasWidth = totalWidth > width ? width : totalWidth

    canvasCtx.beginPath()
    canvasCtx.lineWidth = 1
    canvasCtx.fillStyle = headerColor
    canvasCtx.fillRect(0.5, 0.5, canvasWidth, headerHeight)

    canvasCtx.strokeStyle = lineColor
    canvasCtx.strokeRect(0.5, 0.5, canvasWidth, headerHeight)

    unionColumn.forEach(column => {
        let { x, label, width } = column
        let textY = (13 + headerHeight) / 2
        let text = textOverflow(state, label, width).text
        canvasCtx.beginPath()
        canvasCtx.lineWidth = 1
        canvasCtx.strokeStyle = lineColor
        canvasCtx.moveTo(x, 0)
        canvasCtx.lineTo(x, headerHeight)
        canvasCtx.stroke()

        canvasCtx.beginPath()
        canvasCtx.font = `${font}`
        canvasCtx.fillStyle = '#000'
        canvasCtx.fillText(text, x + cellPaddingWidth, textY)
    })
}

function paintBody(state: State): void {
    let canvasCtx = state.canvasCtx as CanvasRenderingContext2D
    let { unionData, unionColumn, totalWidth, totalHeight } = state
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


        unionColumn.forEach(column => {
            let { key, x } = column
            let { text } = textOverflow(state, item[key], column.width)
            // draw vertical line
            canvasCtx.beginPath()
            canvasCtx.strokeStyle = lineColor
            canvasCtx.moveTo(column.x, 0)
            canvasCtx.lineTo(column.x, totalHeight)
            canvasCtx.stroke()
            // draw text
            canvasCtx.beginPath()
            canvasCtx.font = `${font}`
            canvasCtx.fillText(text, x + cellPaddingWidth, item.y - 7)
        })
    })
}