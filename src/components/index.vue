<template>
  <div class="canvas-table-wrapper"
       ref="wrapperRef">
    <canvas ref="canvasRef"></canvas>
    <div class="divide-line"
         ref="divideLineRef"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, onMounted, PropType, ref, toRefs, watch, computed } from "vue"
  import { formatData } from '../core/data'
  import { initCanvas, paintCanvas } from '../core/canvas'
  import { addDivideLineEvent, handleShowDivideLine } from '../core/divideLine'
  import { debounce } from '../utils'
  import { State, Column, UnionColumn } from '../types'
  import { usePosition } from '../hooks/usePosition'
  import DoublyLinkedList from '../utils/linkedList'

  let state = reactive<State>({
    canvasEle: null,
    canvasCtx: null,
    wrapperPosition: {
      left: 0,
      top: 0
    },
    columns: [],
    unionColumn: [],
    unionData: [],
    totalHeight: 0,
    columnLinkList: new DoublyLinkedList<UnionColumn>()
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
      const wrapperRef = ref<HTMLDivElement | null>(null)
      const canvasRef = ref<HTMLCanvasElement | null>(null)
      const divideLineRef = ref<HTMLDivElement | null>(null)

      let { columns, data } = toRefs(props)

      columns.value.forEach(column => state.columnLinkList.add(column))
      state.columnLinkList.traverse(node => {
        let { width } = node.data
        node.data.xLeft = node.prev ? node.prev.data.xRight : 0
        node.data.xRight = (node.prev ? node.prev.data.xRight : 0) + node.data.width
      })


      let { unionColumn, cloneData, totalWidth, totalHeight } = formatData(columns, data)
      state.unionData = cloneData
      state.totalHeight = totalHeight

      onMounted(() => {
        let wrapperEle = wrapperRef.value as HTMLDivElement
        let { left, top } = wrapperEle.getBoundingClientRect()
        state.wrapperPosition = {
          left,
          top
        }
        let canvasEle = canvasRef.value as HTMLCanvasElement
        let canvasCtx = canvasEle.getContext('2d') as CanvasRenderingContext2D
        let divideLineEle = divideLineRef.value as HTMLDivElement
        state.canvasEle = canvasEle
        state.canvasCtx = canvasCtx

        initCanvas(canvasEle, canvasCtx)
        watch(state.columnLinkList, () => {
          // let { unionColumn, cloneData, totalWidth, totalHeight } = formatData(columns, data)
          // let columnLinkList = new DoublyLinkedList<UnionColumn>()
          // unionColumn.forEach(column => columnLinkList.add(column))
          // state.columnLinkList = columnLinkList
          // state.totalWidth = totalWidth
          paintCanvas(state)
        }, { immediate: true })

        addDivideLineEvent(divideLineEle, state)
        let { x, y } = usePosition(state.canvasEle as HTMLCanvasElement)
        watch([x, y], debounce(handleShowDivideLine(divideLineEle, state)))

      })

      return {
        wrapperRef,
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
