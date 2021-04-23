<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
<<<<<<< HEAD
  import { onMounted, ref, toRefs } from 'vue'
  import { config } from '../config'

=======
  import { onMounted, ref } from 'vue'
>>>>>>> ceb93bdbffa886f7e9aafd11dbcb816ed9a62188
  export default {
    props: {
      columns: Array
    },
    setup (props) {
      const canvas = ref(null)
<<<<<<< HEAD
      let { columns } = toRefs(props)

      let paint = (canvas, cols) => {
        console.log('canvas: ', canvas)
        canvas.width = config.width
        canvas.height = config.height
        cols.reduce((sums, current) => {
          console.log('currentcurrentcurrent: ', current)
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
      let paintHorizontalLine = () => {

        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = config.lineColor
        ctx.moveTo(0, 0)
        ctx.lineTo(200, 0)
        ctx.stroke()
      }


      onMounted(() => {
        let ctx = canvas.value.getContext('2d')
        paint(ctx, columns.value)
      })

=======
      onMounted(() => {
        console.log('canvas.value: ', canvas.value)
      })
>>>>>>> ceb93bdbffa886f7e9aafd11dbcb816ed9a62188
      return {
        canvas
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
