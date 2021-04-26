<template>
  <div>
    <canvas ref="canvas"></canvas>
    <canvas ref="textCanvas"></canvas>
  </div>
</template>

<script lang="ts">
  import { onMounted, ref, toRefs } from "vue"
  import { config } from "../config"
  import { paintHeader } from "../utils/paint"

  let initCanvas = (canvas: CanvasRenderingContext2D, canvasEle: HTMLCanvasElement) => {
    let devicePixelRatio = window.devicePixelRatio
    canvasEle.width = Math.round(config.width * devicePixelRatio)
    canvasEle.height = Math.round(config.height * devicePixelRatio)
    canvasEle.style.width = config.width + 'px'
    canvasEle.style.height = config.height + 'px'
    canvas.scale(devicePixelRatio, devicePixelRatio)
  }

  export default {
    props: {
      columns: Array,
    },
    setup(props) {
      const canvas = ref(null)
      const textCanvas = ref(null)
      let { columns } = toRefs(props)

      let paint = (canvas: CanvasRenderingContext2D, cols, canvasEle: HTMLCanvasElement) => {


        cols.reduce((sums, current) => {
          console.log("currentcurrentcurrent: ", current)
          if (!sums) paintVerticalLine(canvas, 0 + 0.5, config.rowHeight)
          let x = sums + current.width
          paintVerticalLine(canvas, x + 0.5, config.rowHeight)
          return x
        }, 0)
      }

      let paintVerticalLine = (ctx, x, y) => {
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = config.lineColor
        ctx.moveTo(x, 0)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
      let paintHorizontalLine = (ctx) => {
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = config.lineColor
        ctx.moveTo(0, 0)
        ctx.lineTo(200, 0)
        ctx.stroke()
      }

      onMounted(() => {
        let canvasEle = canvas.value as HTMLCanvasElement
        let textCanvasEle = textCanvas.value as HTMLCanvasElement
        let ctx = canvasEle.getContext("2d") as CanvasRenderingContext2D
        let textCtx = textCanvasEle.getContext("2d")
        initCanvas(ctx, canvasEle)
        paint(ctx, columns.value, canvasEle)
        paintHeader(ctx, columns.value)
      })

      return {
        canvas,
        textCanvas
      }
    },
  }
</script>

<style scoped lang="scss">
</style>
