<template>
    <div>
        <h1>首页</h1>
        <tiny-button type="primary" @click="handleTest">测试</tiny-button>
    </div>
</template>

<script setup lang="ts">
import { test } from '@/api/user'
import { TinyButton } from '@opentiny/vue'


const handleTest = () => {
    test().then(res => {
        console.log("success=",res)
    })
}
</script>

<style scoped>

</style>