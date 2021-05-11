import config from '../config'

export function init(canvasEle: HTMLCanvasElement, canvasCtx: CanvasRenderingContext2D): void {
    let devicePixelRatio = window.devicePixelRatio
    let { width, height } = config

    canvasEle.width = width * devicePixelRatio
    canvasEle.height = height * devicePixelRatio
    canvasEle.style.width = `${width}px`
    canvasEle.style.height = `${height}px`
    canvasCtx.scale(devicePixelRatio, devicePixelRatio)
}
