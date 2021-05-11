<template>
  <div class="canvas-table-wrapper">
    <canvas ref="canvasRef"></canvas>
    <div class="divide-line"
         ref="divideLineRef"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, onMounted, PropType, ref, Ref, toRefs, watch } from "vue"
  import { init } from '../core/init'
  import { paint } from '../core/paint'
  import { flatData } from '../utils'
  import config from "../config"
  import { State, Column, UnionColumn, SingleData, Fn, TAnyFunction } from '../types'
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

      let { rowHeight, headerHeight, lineColor } = config
      let { columns, data } = toRefs(props)
      let unionColumn: UnionColumn[] = flatData(columns)
      let lastColumn: UnionColumn = unionColumn[unionColumn.length - 1]
      let totalWidth: number = lastColumn.x + lastColumn.width

      let cloneData: SingleData[] = JSON.parse(JSON.stringify(data.value))
      let totalHeight = cloneData.reduce((pre, cur, index): number => {
        let y = index ? pre + rowHeight : headerHeight + rowHeight
        cur.y = y
        return y
      }, 0)

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

        init(canvasEle, canvasCtx)
        paint(state)

        divideLineEle.addEventListener('mousedown', function (e: MouseEvent) {
          this.style.height = `${totalHeight}px`
          this.style.backgroundColor = `${lineColor}`
          this.style.display = 'block'
        })
        divideLineEle.addEventListener('mouseup', function (e: MouseEvent) {
          this.style.backgroundColor = `transparent`
          this.style.display = 'none'
        })

        let { x, y } = usePosition(state.canvasEle as HTMLCanvasElement)
        let fn = (positionArr: number[]): void => {
          let [x, y] = positionArr
          let { unionColumn } = state
          let { headerHeight } = config
          let rangeArr = unionColumn.map(item => item.x + item.width)
          const DIS = 2
          for (let i = 0, j = rangeArr.length; i < j; i++) {
            if (y <= headerHeight && (x > (rangeArr[i] - DIS) && x < (rangeArr[i] + DIS))) {
              divideLineEle.style.left = `${rangeArr[i] - 1}px`
              // divideLineEle.style.height = `${totalHeight}px`
              divideLineEle.style.display = 'block'
              break
            } else {
              divideLineEle.style.display = 'none'
            }
          }
        }

        let debounce = (fn: TAnyFunction, delay: number = 16.7): Fn => {
          let timer: number = 0
          return function handler(...args) {
            if (timer) clearTimeout(timer)
            timer = window.setTimeout(() => {
              fn.apply(this, args)
            }, delay)
          }
        }
        watch([x, y], debounce(fn))

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
