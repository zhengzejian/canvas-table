<template>
  <div class="canvas-table-wrapper">
    <canvas ref="canvasRef"></canvas>
    <div class="divide-line"
         ref="divideLineRef"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType, ref, Ref, toRefs } from "vue"
  import { setCanvas, setColumns, setData, setTotalHeight } from '../core/store'
  import { init } from '../core/init'
  import { paint } from '../core/paint'
  import { flatData } from '../utils'
  import config from "../config"
  import { Column, $columns } from '../types'
  import { setTotalWidth, singleData } from '../core/store'

  export default defineComponent({
    props: {
      columns: {
        type: Array as PropType<Column[]>,
        default: () => []
      },
      data: {
        type: Array,
        default: () => []
      }
    },
    setup(props) {
      const canvasRef = ref<HTMLCanvasElement | null>(null)
      const divideLineRef = ref<HTMLDivElement | null>(null)
      let { rowHeight, headerHeight } = config
      let { columns, data } = toRefs(props)
      let _columns: $columns[] = flatData(columns)
      let lastColumn: $columns = _columns[_columns.length - 1]
      let totalWidth: number = lastColumn.x + lastColumn.width

      let cloneData: singleData[] = JSON.parse(JSON.stringify(data.value))
      let totalHeight = cloneData.reduce((pre, cur, index): number => {
        let y = index ? pre + rowHeight : headerHeight + rowHeight
        cur.y = y
        return y
      }, 0)

      setColumns(_columns)
      setData(cloneData)
      setTotalWidth(totalWidth)
      setTotalHeight(totalHeight)

      onMounted(() => {
        setCanvas(canvasRef as Ref<HTMLCanvasElement>)
        init()
        paint()
      })

      return {
        canvasRef,
        divideLineRef
      }
    },
  })
</script>

<style scoped lang="scss">
  .canvas-table-wrapper {
    position: relative;
    .divide-line {
      position: absolute;
      left: 200px;
      top: 0;
      width: 1px;
      background-color: blue;
    }
  }
</style>
