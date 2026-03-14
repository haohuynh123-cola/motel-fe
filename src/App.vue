<script setup lang="ts">
  // Trang gốc chỉ chứa router-view để vue-router quyết định hiện Login hay AdminLayout
</script>

<template>
  <router-view></router-view>
</template>

<style>
  /* Reset margin/padding */
  html,
  body,
  #app {
    margin: 0;
    padding: 0;
    height: 100%;
  }
</style>
