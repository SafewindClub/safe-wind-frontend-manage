<template>
  <div class="tag-list-container">
    <tiny-tabs v-model="menuStore.activeName" tab-style="button-card" :with-close="true" :before-close="beforeClose"
      @close="close" @click="handleTabClick" :draggable="true" @drag-end="handleDragEnd" :drag-sort="true"
      size="small" :drop-config="dropConfig">
      <tiny-tab-item v-for="item in menuStore.tabs" :key="item.name" :title="item.title" :name="item.name"
        :with-close="item.withClose">
      </tiny-tab-item>
    </tiny-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TinyTabs, TinyTabItem } from '@opentiny/vue'
import { useRouter } from 'vue-router'
import Sortable from 'sortablejs'
import { useMenuStore } from '@/stores/menu'
const router = useRouter()
const menuStore = useMenuStore()
const dropConfig = ref({
  plugin: Sortable
})
// 关闭标签前的处理
const beforeClose = (name: string) => {
  return name !== 'dashboard'
}
// 点击标签
const handleTabClick = (tab: any) => {
  const routeName = tab.name.charAt(0).toUpperCase() + tab.name.slice(1)
  router.push({ name: routeName })
}

// 关闭标签
const close = (name: string) => {
  const index = menuStore.tabs.findIndex(tab => tab.name === name)
  if (index === -1) return

  menuStore.tabs = menuStore.tabs.filter(tab => tab.name !== name)

  // 如果关闭的是当前激活的标签，则激活前一个标签
  if (menuStore.activeName === name) {
    const nextTab = menuStore.tabs[index - 1] || menuStore.tabs[0]
    menuStore.activeName = nextTab.name
  }
}

// 处理拖拽结束
const handleDragEnd = (newTabs: any[]) => {
  // 更新标签顺序
  menuStore.tabs = newTabs.map(tab => ({
    ...tab,
    withClose: tab.name === 'dashboard' ? false : true
  }))
}

</script>

<style scoped></style>
