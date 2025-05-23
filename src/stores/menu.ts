import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
    // 左侧宽度，默认210
    const asideWidth = ref(210)
    // 是否折叠，默认false
    const isCollapse = ref(false)
    // 是否全屏，默认false
    const isFullscreen = ref(false)
    // 底部高度
    const footerHeight = ref(30)
    // 折叠
    const toggleCollapse = () => {
        isCollapse.value = !isCollapse.value
        asideWidth.value = isCollapse.value ? 64 : 210
    }
    //全屏
    const toggleFullscreen = () => {
        isFullscreen.value = !isFullscreen.value
    }
    return {
        asideWidth,
        isCollapse,
        isFullscreen,
        footerHeight,
        toggleCollapse,
        toggleFullscreen,
    }
})