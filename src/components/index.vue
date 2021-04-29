<template>
  <div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType, ref, toRefs } from "vue"
  import { setCanvas, setColumns, setData, setTotalHeight } from '../core/store'
  import { init } from '../core/init'
  import { paint } from '../core/paint'
  import { flatData } from '../utils'
  import config from "../config"
  import { Column, $columns } from '../types'
  import { paintHeader } from "../utils/paint"
  import { setTotalWidth, singleData } from '../core/store'

  export default defineComponent({
    props: {
      columns: Array as PropType<Column[]>,
      data: {
        type: Array,
        default: () => []
      }
    },
    setup(props) {
      let { rowHeight, headerHeight } = config
      const canvasRef = ref(null)
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
        setCanvas(canvasRef)
        init()
        paint()
      })

      return {
        canvasRef
      }
    },
  })
</script>

<style scoped lang="scss">
</style>
