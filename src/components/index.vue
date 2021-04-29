<template>
  <div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, PropType, ref, toRefs } from "vue"
  import { setCanvas, setColumns } from '../core/store'
  import { init } from '../core/init'
  import { paint } from '../core/paint'
  import { flatData } from '../utils'
  import config from "../config"
  import { Column, $columns } from '../types'
  import { paintHeader } from "../utils/paint"
  import { setTotalWidth } from '../core/store'

  export default defineComponent({
    props: {
      columns: Array as PropType<Column[]>,
    },
    setup(props) {
      const canvasRef = ref(null)
      let { columns } = toRefs(props)
      let _columns: $columns[] = flatData(columns)
      setColumns(_columns)
      let lastColumn: $columns = _columns[_columns.length - 1]
      let totalWidth: number = lastColumn.x + lastColumn.width
      setTotalWidth(totalWidth)

      onMounted(() => {
        setCanvas(canvasRef)
        init()
        paint(canvasRef, columns)
      })

      return {
        canvasRef
      }
    },
  })
</script>

<style scoped lang="scss">
</style>
