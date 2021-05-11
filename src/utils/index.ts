import { Ref } from 'vue'
import config from '../config'
import { Column, UnionColumn, State, TextOverflowData } from '../types'

let chineseReg: RegExp = /\u4e00-\u9fa5|%/

let numWidth: number = 0
let threePointWidth: number = 0

export function flatData(columns: Ref<Column[]>): UnionColumn[] {

    let data: UnionColumn[] = JSON.parse(JSON.stringify(columns.value))
    data.reduce((pre, cur) => {
        cur.x = pre
        return pre + cur.width
    }, 0)
    return data
}

export function textOverflow(state: State, text: string, width: number): TextOverflowData {
    let { fontSize, cellPaddingWidth } = config
    let canvasCtx = state.canvasCtx as CanvasRenderingContext2D
    typeof text !== 'string' && (text = text + '')
    let textWidth = canvasCtx.measureText(text).width
    let texData: TextOverflowData = {
        textWidth: textWidth,
        isOverflow: false,
        text: text
    }
    let actualWidth = width - 2 * cellPaddingWidth
    if (actualWidth >= textWidth) return texData

    numWidth || (numWidth = canvasCtx.measureText('0').width)
    threePointWidth || (threePointWidth = canvasCtx.measureText('...').width)
    let arr = [...text], length = 2 * cellPaddingWidth, showText = ''

    for (let i = 0; i < arr.length; i++) {
        if (length < (actualWidth - threePointWidth)) {
            let singleText = arr[i]
            if (chineseReg.test(singleText)) {
                length += fontSize
            } else if (/\d/.test(singleText)) {
                length += numWidth
            } else {
                length += canvasCtx.measureText(singleText).width
            }
            showText += singleText
        } else {
            length += threePointWidth
            showText += '...'
            break
        }
    }
    texData.textWidth = length
    texData.text = showText
    texData.isOverflow = true
    return texData
}