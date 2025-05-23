<template>
    <tiny-fullscreen :teleport="true" :z-index="999" :fullscreen="menuStore.isFullscreen"
        @update:fullscreen="menuStore.isFullscreen = $event">
        <tiny-container pattern="simple" :aside-width="menuStore.asideWidth">
            <!--左边-->
            <template #aside>
                <AdminAside />
            </template>
            <!--右边-->
            <template #default>
                <tiny-container :footer-height="menuStore.footerHeight" pattern="classic">
                    <!--头部-->
                    <template #header>
                        <div class="header-wrapper">
                            <AdminHeader />
                            <AdminTagList />
                        </div>
                    </template>
                    <!--内容-->
                    <template #default>
                        <AdminMain />
                    </template>
                    <!--底部-->
                    <template #footer>
                        <AdminFooter />
                    </template>
                </tiny-container>
            </template>
        </tiny-container>
    </tiny-fullscreen>
</template>

<script setup lang="ts">
import { TinyContainer, TinyFullscreen } from '@opentiny/vue'
import AdminAside from './components/AdminAside.vue'
import AdminHeader from './components/AdminHeader.vue'
import AdminTagList from './components/AdminTagList.vue'
import AdminMain from './components/AdminMain.vue'
import AdminFooter from './components/AdminFooter.vue'
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()

</script>

<style scoped>
:deep(.tiny-fullscreen) {
    height: 100vh;
    overflow: hidden;
}

:deep(.tiny-container) {
    height: 100vh;
}

:deep(.tiny-container__header) {
    height: 70px;
    padding: 0;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.tiny-container__aside) {
    width: 210px;
    background-color: #fefefe;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.tiny-container__aside.is-collapse) {
    width: 64px;
}

:deep(.tiny-container__main) {
    background-color: #f0f2f5;
    padding: 0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.tiny-container__aside.is-collapse) ~ .tiny-container__main {
    margin-left: 64px;
}

.header-wrapper {
    display: flex;
    flex-direction: column;
}

:deep(.tiny-container__footer) {
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #666;
    background-color: #fff;
}
</style>