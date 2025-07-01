<template>
    <div>
      <tiny-input v-model="search" placeholder="搜索图标" style="margin-bottom: 8px;" />
      <div class="icon-list">
        <div
          v-for="icon in filteredIcons"
          :key="icon"
          class="icon-item"
          :class="{ active: icon === modelValue }"
          @click="selectIcon(icon)"
        >
          <svg-icon :icon="icon" />
          <div class="icon-name">{{ icon }}</div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import SvgIcon from '@/components/SvgIcon/index.vue' // svg渲染组件
  import icons from '@/components/SelectIcon/icons' // 所有图标
  
  const props = defineProps({
    modelValue: String
  })
  const emit = defineEmits(['update:modelValue'])
  
  const search = ref('')
  const filteredIcons = computed(() =>
    icons.filter(i => i.includes(search.value))
  )
  
  function selectIcon(icon: string) {
    emit('update:modelValue', icon)
  }
  </script>
  
  <style scoped>
  .icon-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    max-height: 300px;
    overflow-y: auto;
  }
  .icon-item {
    width: 60px;
    text-align: center;
    cursor: pointer;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 6px 0;
    transition: border 0.2s;
  }
  .icon-item.active {
    border: 1.5px solid #409eff;
    background: #f0f7ff;
  }
  .icon-name {
    font-size: 12px;
    margin-top: 2px;
    color: #888;
  }
  </style>