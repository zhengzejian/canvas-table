<template>
  <div class="canvas-table-wrapper"
       ref="wrapperRef">
    <canvas ref="canvasRef"></canvas>
    <div class="scroll-bar-y"
         ref="scrollBarYRef"></div>
    <div class="divide-line"
         ref="divideLineRef"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, onMounted, PropType, ref, toRefs, watch, computed } from "vue"
  import { formatData } from '../core/data'
  import { initCanvas, paintCanvas } from '../core/canvas'
  import { addDivideLineEvent, handleShowDivideLine } from '../core/divideLine'
  import { addScrollBarEvent } from '../core/scrollBar'
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
      const scrollBarYRef = ref<HTMLDivElement | null>(null)

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
        let scrollBarYEle = scrollBarYRef.value as HTMLDivElement
        state.canvasEle = canvasEle
        state.canvasCtx = canvasCtx

        initCanvas(canvasEle, canvasCtx)
        watch(state.columnLinkList, (val) => {
          paintCanvas(state)
        }, { immediate: true })

        addDivideLineEvent(divideLineEle, state)
        let { x, y } = usePosition(state.canvasEle as HTMLCanvasElement)
        watch([x, y], debounce(handleShowDivideLine(divideLineEle, state)))

        addScrollBarEvent(scrollBarYEle, state)
      })

      return {
        wrapperRef,
        canvasRef,
        divideLineRef,
        scrollBarYRef
      }
    }
  })
</script>

<style scoped lang="scss">
  .canvas-table-wrapper {
    position: relative;
    .scroll-bar-y {
      display: none;
      position: absolute;
      right: 0;
      height: 50px;
      width: 10px;
      border-radius: 5px;
      background-color: rgba(0, 0, 255, 0.3);
      top: 0;
    }
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
