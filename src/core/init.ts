import { Ref, inject } from 'vue'
import { state } from './store'
import config from '../config'

export function init(): void {
    let devicePixelRatio = window.devicePixelRatio
    let { width, height } = config
    let canvasEle = state.canvasEle as HTMLCanvasElement
    let canvasCtx = state.canvasCtx as CanvasRenderingContext2D

    canvasEle.width = width * devicePixelRatio
    canvasEle.height = height * devicePixelRatio
    canvasEle.style.width = `${width}px`
    canvasEle.style.height = `${height}px`
    canvasCtx.scale(devicePixelRatio, devicePixelRatio)
}
