import { reactive, Ref } from 'vue'
import { Column, $columns } from '../types'

export type singleData = { y: number }

interface State {
    canvasEle: HTMLCanvasElement | null;
    canvasCtx: CanvasRenderingContext2D | null;
    columns: Column[];
    $columns: $columns[];
    $data: singleData[],
    totalWidth: number;
    totalHeight: number;
}

export let state = reactive<State>({
    canvasEle: null,
    canvasCtx: null,
    columns: [],
    $columns: [],
    $data: [],
    totalWidth: 0,
    totalHeight: 0
})

export function setCanvas(canvas: Ref<HTMLCanvasElement>): void {
    state.canvasEle = canvas.value
    state.canvasCtx = canvas.value.getContext('2d')
}

export function setColumns(data: $columns[]): void {
    state.$columns = data
}

export function setTotalWidth(width: number): void {
    state.totalWidth = width
}

export function setTotalHeight(height: number): void {
    state.totalHeight = height
}

export function setData(data: singleData[]) {
    state.$data = data
}