<script setup>
import { RouterView } from 'vue-router'
import NavComp from '@/components/NavComp.vue'
</script>

<template>
  <div class="BasicGrid">
    <RouterView />
    <div class="h-[45px]">
      <NavComp />
    </div>
  </div>
</template>

<style scoped>
.BasicGrid {
  display: grid;
  height: 100dvh;
  grid-template-rows: 1fr 45px;
}
</style>
