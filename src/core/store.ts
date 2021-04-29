import { reactive, Ref } from 'vue'
import { Column, $columns } from '../types'

interface State {
    canvasEle: HTMLCanvasElement | null;
    canvasCtx: CanvasRenderingContext2D | null;
    columns: Column[];
    $columns: $columns[];
    totalWidth: number;
}

export let state = reactive<State>({
    canvasEle: null,
    canvasCtx: null,
    columns: [],
    $columns: [],
    totalWidth: 0
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