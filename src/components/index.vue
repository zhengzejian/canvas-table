<template>
  <div class="canvas-table-wrapper">
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

  let aa = computed(() => 1)
  console.log('aa: ', aa.value)
  let bb = reactive({ aa: aa })
  console.log("bb: ", bb.aa.value)

  let state = reactive<State>({
    canvasEle: null,
    canvasCtx: null,
    columns: [],
    unionColumn: [],
    unionData: [],
    totalWidth: 0,
    totalHeight: 0,
    columnLinkList: null
  })
  // state.columnLinkList
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


      let columnLinkList = new DoublyLinkedList<UnionColumn>()
      let { columns, data } = toRefs(props)

      columns.value.forEach(column => columnLinkList.add(column))
      columnLinkList.traverse(node => {
        node.data.width = ref(node.data.width)
        node.data.xLeft = computed(() => {
          if (!node.prev) return 0
          let { xLeft, width } = node.prev.data
          return xLeft.value + width.value
        })
        node.data.xRight = computed(() => {
          let { xLeft, width } = node.data
          return xLeft.value + width.value
        })
      })

      // columns.value.forEach(item => {
      //   item.x = computed()
      //   let column: UnionColumn = item
      //   console.log(column)
      // })


      // let { unionColumn, cloneData, totalWidth, totalHeight } = formatData(columns, data)
      // let columnLinkList = new DoublyLinkedList<UnionColumn>()
      // unionColumn.forEach(column => columnLinkList.add(column))
      console.log('columnLinkListcolumnLinkListcolumnLinkList: ', columnLinkList)
      state.columnLinkList = columnLinkList
      // state.unionColumn = unionColumn
      // state.unionData = cloneData
      // state.totalWidth = totalWidth
      // state.totalHeight = totalHeight

      onMounted(() => {
        let canvasEle = canvasRef.value as HTMLCanvasElement
        let canvasCtx = canvasEle.getContext('2d') as CanvasRenderingContext2D
        let divideLineEle = divideLineRef.value as HTMLDivElement
        state.canvasEle = canvasEle
        state.canvasCtx = canvasCtx

        initCanvas(canvasEle, canvasCtx)
        // paintCanvas(state)
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
