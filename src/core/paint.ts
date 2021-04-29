import { Ref, watch } from 'vue'
import { state } from '../core/store'
import { Column } from '../types'
import config from '../config'

export function paint(canvas: Ref<HTMLCanvasElement>, columns: Ref<Column[]>): void {
    paintHeader(canvas, columns)

}

function paintHeader(canvas: Ref<HTMLCanvasElement>, columns: Ref<Column[]>): void {

    let { width, headerHeight, cellPaddingWidth, font } = config
    let canvasCtx = state.canvasCtx as CanvasRenderingContext2D
    let { totalWidth, $columns } = state
    let canvasWidth = totalWidth > width ? width : totalWidth

    canvasCtx.beginPath()
    canvasCtx.strokeRect(0.5, 0.5, canvasWidth, headerHeight)
    $columns.forEach(column => {
        let { x, label } = column
        let textY = (13 + headerHeight) / 2
        canvasCtx.beginPath()
        canvasCtx.moveTo(x, 0)
        canvasCtx.lineTo(x, headerHeight)
        canvasCtx.stroke()

        canvasCtx.beginPath()
        canvasCtx.font = `${font}`
        canvasCtx.fillText(label, x + cellPaddingWidth, textY)
    })
}