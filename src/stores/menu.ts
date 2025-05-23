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
    // 头部高度
    const headerHeight = ref(78)
    // 当前激活的标签
    const activeName = ref('dashboard')
    // 标签导航栏
    const tabs = ref([
        {
            title: '首页',
            name: 'dashboard',
            withClose: false
        }
    ])
    // 折叠
    const toggleCollapse = () => {
        isCollapse.value = !isCollapse.value
        asideWidth.value = isCollapse.value ? 64 : 210
    }
    //全屏
    const toggleFullscreen = () => {
        isFullscreen.value = !isFullscreen.value
    }
    // 添加标签导航栏
    const addTab = (info: any) => {
        const { name, title, withClose } = info
        const isExist = tabs.value.some(tab => tab.name === name)

        if (!isExist) {
            tabs.value.push({
                title: title || '未命名',
                name: name,
                withClose: withClose
            })
        }
        activeName.value = name
    }
    
    return {
        asideWidth,
        isCollapse,
        isFullscreen,
        footerHeight,
        headerHeight,
        activeName,
        tabs,
        addTab,
        toggleCollapse,
        toggleFullscreen,
    }
})