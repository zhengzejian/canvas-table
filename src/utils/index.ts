import { Ref } from 'vue'
import { Column, $columns } from '../types'
interface CanvasCtx {
    canvasEle: HTMLCanvasElement;
    canvasCtx: CanvasRenderingContext2D;
}

export function getCanvasCtx(canvas: Ref<HTMLCanvasElement>): CanvasCtx {
    let canvasEle = canvas.value
    let canvasCtx = canvasEle.getContext('2d') as CanvasRenderingContext2D
    return {
        canvasEle,
        canvasCtx
    }
}

export function flatData(columns: Ref<Column[]>): $columns[] {

    let data: $columns[] = JSON.parse(JSON.stringify(columns.value))
    data.reduce((pre, cur) => {
        cur.x = pre
        return pre + cur.width
    }, 0)
    return data
}