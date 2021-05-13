<template>
  <div class="canvas-table-wrapper">
    <canvas ref="canvasRef"></canvas>
    <div class="divide-line"
         ref="divideLineRef"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, onMounted, PropType, ref, toRefs, watch } from "vue"
  import { formatData } from '../core/data'
  import { initCanvas, paintCanvas } from '../core/canvas'
  import { addDivideLineEvent, handleShowDivideLine } from '../core/divideLine'
  import { debounce } from '../utils'
  import { State, Column } from '../types'
  import { usePosition } from '../hooks/usePosition'

  let state = reactive<State>({
    canvasEle: null,
    canvasCtx: null,
    columns: [],
    unionColumn: [],
    unionData: [],
    totalWidth: 0,
    totalHeight: 0
  })

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

      let { columns, data } = toRefs(props)
      let { unionColumn, cloneData, totalWidth, totalHeight } = formatData(columns, data)

      state.unionColumn = unionColumn
      state.unionData = cloneData
      state.totalWidth = totalWidth
      state.totalHeight = totalHeight

      onMounted(() => {
        let canvasEle = canvasRef.value as HTMLCanvasElement
        let canvasCtx = canvasEle.getContext('2d') as CanvasRenderingContext2D
        let divideLineEle = divideLineRef.value as HTMLDivElement
        state.canvasEle = canvasEle
        state.canvasCtx = canvasCtx

        initCanvas(canvasEle, canvasCtx)
        paintCanvas(state)

        addDivideLineEvent(divideLineEle, totalHeight)
        let { x, y } = usePosition(state.canvasEle as HTMLCanvasElement)
        watch([x, y], debounce(handleShowDivideLine(divideLineEle, state)))

      })

      return {
        canvasRef,
        divideLineRef
      }
    }
  })
</script>

<style scoped lang="scss">
  .canvas-table-wrapper {
    position: relative;
    .divide-line {
      position: absolute;
      height: 28px;
      left: 200px;
      top: 0;
      width: 3px;
      cursor: col-resize;
      &::after,
      &::before {
        content: "";
        position: absolute;
        left: -2px;
        right: -2px;
        height: 100%;
      }
    }
  }
</style>
