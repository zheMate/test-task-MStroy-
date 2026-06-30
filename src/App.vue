<script setup lang="ts">
import TreeTable from './components/TreeTable.vue'
</script>

<template>
  <div id="app">
    <TreeTable />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  padding: 24px;
  background: #fff;
  min-height: 100vh;
}
</style>
