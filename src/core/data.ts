import { Ref } from 'vue'
import { Column, UnionColumn, SingleData } from '../types'
import { flatData } from '../utils'
import config from '../config'

export function formatData(columns: Ref<Column[]>, data: Ref<any[]>) {
    let { headerHeight, rowHeight } = config

    let unionColumn: UnionColumn[] = flatData(columns)
    let lastColumn: UnionColumn = unionColumn[unionColumn.length - 1]
    let totalWidth: number = lastColumn.x + lastColumn.width
    let cloneData: SingleData[] = JSON.parse(JSON.stringify(data.value))
    let totalHeight = cloneData.reduce((pre, cur, index): number => {
        let y = index ? pre + rowHeight : headerHeight + rowHeight
        cur.y = y
        return y
    }, 0)

    return {
        unionColumn,
        cloneData,
        totalWidth,
        totalHeight
    }
}