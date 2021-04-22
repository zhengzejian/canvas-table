<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
  import { onMounted, ref } from 'vue'
  export default {
    setup (props) {
      const canvas = ref(null)
      onMounted(() => {
        console.log('canvas.value: ', canvas.value)
      })
      return {
        canvas
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
