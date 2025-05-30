<template>
  <div class="admin-main-container">
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.admin-main-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  background-color: #f5f7fa;
  padding: 5px;
}
</style>
