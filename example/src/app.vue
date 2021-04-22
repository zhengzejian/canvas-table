<template>
  <div>
    {{text}}
    <canvas-table></canvas-table>
  </div>
</template>

<script>
  import { reactive } from 'vue'
  export default {
    setup () {
      let obj = reactive({ text: 'hello world!' })
      return obj
    }
  }
</script>

<style scoped lang="scss">
</style>
