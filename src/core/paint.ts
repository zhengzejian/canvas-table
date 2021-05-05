import { state } from '../core/store'
import config from '../config'
import { textOverflow } from '../utils'

export function paint(): void {
    let { $data } = state
    paintHeader()
    if ($data.length) {
        paintBody()
    }

}

// draw header
function paintHeader(): void {

    let { width, headerHeight, headerColor, cellPaddingWidth, font, lineColor } = config
    let canvasCtx = state.canvasCtx as CanvasRenderingContext2D
    let { totalWidth, $columns } = state
    let canvasWidth = totalWidth > width ? width : totalWidth

    canvasCtx.beginPath()
    canvasCtx.lineWidth = 1
    canvasCtx.fillStyle = headerColor
    canvasCtx.fillRect(0.5, 0.5, canvasWidth, headerHeight)

    canvasCtx.strokeStyle = lineColor
    canvasCtx.strokeRect(0.5, 0.5, canvasWidth, headerHeight)

    $columns.forEach(column => {
        let { x, label, width } = column
        let textY = (13 + headerHeight) / 2
        let text = textOverflow(label, width).text
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

function paintBody(): void {
    let canvasCtx = state.canvasCtx as CanvasRenderingContext2D
    let { $data, $columns, totalWidth, totalHeight } = state
    let { rowHeight, headerHeight, height, lineColor, font, cellPaddingWidth } = config
    let bodyHeight: number = height - headerHeight
    let dataHeight: number = $data.length * rowHeight
    let actualHeight: number = dataHeight > bodyHeight ? bodyHeight : dataHeight

    canvasCtx.beginPath()
    canvasCtx.strokeStyle = lineColor
    canvasCtx.strokeRect(0 + 0.5, headerHeight, totalWidth, actualHeight - 0.5)

    $data.forEach((item, i) => {
        canvasCtx.beginPath()
        canvasCtx.strokeStyle = lineColor
        canvasCtx.moveTo(0, item.y)
        canvasCtx.lineTo(totalWidth, item.y)
        canvasCtx.stroke()


        $columns.forEach(column => {
            let { key, x } = column
            let text = textOverflow(item[key], column.width).text
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