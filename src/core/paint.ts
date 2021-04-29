import { Ref, watch } from 'vue'
import { state } from '../core/store'
import { Column } from '../types'
import config from '../config'

export function paint(canvas: Ref<HTMLCanvasElement>, columns: Ref<Column[]>): void {
    paintHeader(canvas, columns)
}

// draw header
function paintHeader(canvas: Ref<HTMLCanvasElement>, columns: Ref<Column[]>): void {

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
        let { x, label } = column
        let textY = (13 + headerHeight) / 2
        canvasCtx.beginPath()
        canvasCtx.lineWidth = 1
        canvasCtx.strokeStyle = lineColor
        canvasCtx.moveTo(x, 0)
        canvasCtx.lineTo(x, headerHeight)
        canvasCtx.stroke()

        canvasCtx.beginPath()
        canvasCtx.font = `${font}`
        canvasCtx.fillStyle = '#000'
        canvasCtx.fillText(label, x + cellPaddingWidth, textY)
    })
}