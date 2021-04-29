<template>
  <div>
    <canvas-table :columns="columns"
                  :data="data"></canvas-table>
  </div>
</template>

<script>
  import { reactive } from 'vue'
  import mockData from './mock/data'
  const cols = [
    {
      label: '第一行',
      key: 'first',
      width: 100
    },
    {
      label: '第二行',
      key: 'second',
      width: 100
    },
    {
      label: '第三行',
      key: 'second',
      width: 100
    },
    {
      label: '第三行',
      key: 'second',
      width: 100
    }
  ]
  export default {
    setup () {
      // let obj = reactive({ text: 'hello world!' })
      let columns = reactive(cols)
      let data = reactive(mockData)
      return {
        columns,
        data
      }
    }
  }
</script>
<style scoped lang="scss">
</style>
