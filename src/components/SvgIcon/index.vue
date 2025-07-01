<template>
    <span v-if="svgSrc">
        <img :src="svgSrc" :alt="icon" style="width: 24px; height: 24px;" />
    </span>
</template>
<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{ icon: string }>()
const svgSrc = ref('')

// 使用 import.meta.glob 批量导入 SVG 文件
const svgModules = import.meta.glob('../../assets/icon/*.svg', { eager: false, import: 'default' })

const loadSvg = async (iconName: string) => {
    if (!iconName) {
        svgSrc.value = '';
        console.log(`SvgIcon: 图标名称为空`);
        return;
    }
    
    // 构建正确的相对路径，与 glob 模式匹配
    const path = `../../assets/icon/${iconName}.svg`
    
    if (svgModules[path]) {
        try {
            // 调用对应的导入函数获取 SVG URL
            const module = await svgModules[path]()
            svgSrc.value = module as string // 显式断言为 string 类型
            // console.log(`SvgIcon: 成功加载图标 ${iconName}, 路径: ${svgSrc.value}`)
        } catch (error) {
            console.error(`SvgIcon: 调用 SVG 导入函数失败: ${iconName}`, error)
            svgSrc.value = '';
        }
    } else {
        console.error(`SvgIcon: 未找到 SVG 图标模块: ${iconName}, 路径: ${path}`)
        svgSrc.value = '';
    }
}

onMounted(() => {
    loadSvg(props.icon)
})

watch(() => props.icon, (newIcon) => {
    loadSvg(newIcon)
}, { immediate: true })
</script>