import { column } from '../types'
import { config } from '../config'
const { headerHeight, headerColor, cellPaddingWidth, font } = config
export function paintHeader(ctx: CanvasRenderingContext2D, cols: column[]) {
    let midHeaderHeight = Math.ceil(headerHeight / 2)
    let totalWidth: number = cols.reduce((total: number, current: column) => {
        current.x = total
        return total + current.width
    }, 0)
    // ctx.beginPath()
    // ctx.fillStyle = headerColor
    // ctx.fillRect(0, 0, totalWidth, headerHeight)
    // ctx.closePath()

    cols.forEach((col) => {
        let x = col.x
        ctx.beginPath()
        ctx.font = `bold ${font}`
        ctx.textBaseline = 'middle'
        ctx.fillText(col.label, x as number + cellPaddingWidth, midHeaderHeight)
        ctx.closePath()
    })
    // ctx.stroke()
}