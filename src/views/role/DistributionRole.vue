<template>
    <!-- 页面主容器 -->
    <div class="role-container">
        <!-- 搜索区 -->
        <div class="role-search">
            <!-- 搜索表单，包含角色名、角色标识、状态等条件 -->
            <tiny-form label-width="100px" v-model="searchForm" :inline="true"
                style="display: flex; align-items: center" class="role-search-form">
                <tiny-form-item label="用户邮箱" prop="email">
                    <tiny-input v-model="searchForm.email" placeholder="用户邮箱"></tiny-input>
                </tiny-form-item>
                <tiny-form-item label="用户名称" prop="userName">
                    <tiny-input v-model="searchForm.userName" placeholder="用户名称"></tiny-input>
                </tiny-form-item>
                <tiny-form-item>
                    <!-- 查询和重置按钮 -->
                    <tiny-button type="primary" @click="handleSearch">查询</tiny-button>
                    <tiny-button @click="resetForm">重置</tiny-button>
                </tiny-form-item>
            </tiny-form>
        </div>

        <!-- 操作区：新增按钮 -->
        <div class="role-button">
            <tiny-button type="success" @click="addUser" round size="small">添加用户</tiny-button>
        </div>

        <!-- 表格区：角色列表展示 -->
        <div class="role-table">
            <tiny-grid ref="roleGrid" :data="tableData" align="center" overflow="hidden">
                <tiny-grid-column field="userId" title="用户编号" width="10%">
                </tiny-grid-column>
                <tiny-grid-column field="userName" title="用户名称" width="20%">
                </tiny-grid-column>
                <tiny-grid-column field="email" title="用户邮箱" width="30%">
                </tiny-grid-column>
                <tiny-grid-column field="studentId" title="学号" width="15%">
                </tiny-grid-column>
                <tiny-grid-column field="createTime" title="创建时间" width="15%">
                </tiny-grid-column>
                <tiny-grid-column title="操作" width="10%">
                    <template #default="scope">
                        <tiny-button type="danger" size="small" @click="removeUser(scope.row)">移除</tiny-button>
                    </template>
                </tiny-grid-column>
            </tiny-grid>

            <!-- 独立的分页器组件 -->
            <tiny-pager :current-page="pagerConfig.currentPage" :page-size="pagerConfig.pageSize"
                :total="pagerConfig.total" :page-sizes="[5, 10, 20]" @current-change="handleCurrentChange"
                @size-change="handleSizeChange" layout="total, sizes, prev, pager, next, jumper"
                class="role-pager"></tiny-pager>
        </div>

        <!-- 分配用户弹窗 -->
        <tiny-dialog-box v-model:visible="dialogVisible" :title="dialogTitle" width="60%">
            <div class="dialog-content">
                <!-- 未分配用户搜索 -->
                <div class="dialog-search">
                    <tiny-form label-width="100px" v-model="unDistributionRoleQuery" :inline="true">
                        <tiny-form-item label="用户邮箱" prop="email">
                            <tiny-input v-model="unDistributionRoleQuery.email" placeholder="用户邮箱"></tiny-input>
                        </tiny-form-item>
                        <tiny-form-item label="用户名称" prop="userName">
                            <tiny-input v-model="unDistributionRoleQuery.userName" placeholder="用户名称"></tiny-input>
                        </tiny-form-item>
                        <tiny-form-item>
                            <tiny-button type="primary" @click="handleUnDistributionSearch">查询</tiny-button>
                            <tiny-button @click="resetUnDistributionForm">重置</tiny-button>
                        </tiny-form-item>
                    </tiny-form>
                </div>

                <!-- 未分配用户表格 -->
                <div class="dialog-table">
                    <tiny-grid :data="unDistributionRoleTableData" align="center" overflow="hidden">
                        <tiny-grid-column field="userId" title="用户编号" width="10%">
                        </tiny-grid-column>
                        <tiny-grid-column field="userName" title="用户名称" width="20%">
                        </tiny-grid-column>
                        <tiny-grid-column field="email" title="用户邮箱" width="30%">
                        </tiny-grid-column>
                        <tiny-grid-column field="studentId" title="学号" width="15%">
                        </tiny-grid-column>
                        <tiny-grid-column field="createTime" title="创建时间" width="15%">
                        </tiny-grid-column>
                        <tiny-grid-column title="操作" width="10%">
                            <template #default="scope">
                                <tiny-button type="primary" size="small"
                                    @click="assignSingleUser(scope.row)">分配</tiny-button>
                            </template>
                        </tiny-grid-column>
                    </tiny-grid>

                    <!-- 分页器 -->
                    <tiny-pager :current-page="unDistributionRolePagerConfig.currentPage"
                        :page-size="unDistributionRolePagerConfig.pageSize" :total="unDistributionRolePagerConfig.total"
                        :page-sizes="[5, 10, 20]" @current-change="handleUnDistributionCurrentChange"
                        @size-change="handleUnDistributionSizeChange" layout="total, sizes, prev, pager, next, jumper"
                        class="dialog-pager">
                    </tiny-pager>
                </div>

                <!-- 弹窗底部按钮 -->
                <div class="dialog-footer">
                    <tiny-button @click="closeDialog">关闭</tiny-button>
                </div>
            </div>
        </tiny-dialog-box>

    </div>
</template>

<script setup lang="ts">
// 引入Vue相关API
import { ref, onMounted, reactive, nextTick } from "vue";
// 引入TinyVue组件
import {
    Grid as TinyGrid,
    TinyForm,
    TinyFormItem,
    TinyInput,
    TinyButton,
    TinyOption,
    TinyBaseSelect,
    TinyDialogBox,
    TinyNotify,
    TinyModal,
    TinyTag,
    TinyGridColumn,
    TinyTree,
    TinyPager,
    TinyDropdown,
    TinyDropdownMenu,
    TinyDropdownItem,
} from "@opentiny/vue";

// 调用接口
import { queryAssignedUserApi, queryUnassignedUserApi, batchCancelAssignUserApi, assignUserApi, assignSingleUserApi} from "@/api/role";
import { iconNoPerm } from "@opentiny/vue-icon";

// 声明路由
import { useRoute } from "vue-router";
const route = useRoute();
// 获取路由的参数
const routeRoleId = route.query.roleId;

// 用户全局变量
import { useMenuStore } from '@/stores/menu'
const menuStore = useMenuStore();

// 查询分配用户参数
interface DistributionRoleQuery {
    roleId: number;
    userName: string;
    email: string;
}
// 搜索表单数据，包含分页和筛选条件
const searchForm = ref<DistributionRoleQuery>({
    roleId: Number(routeRoleId),
    userName: "",
    email: "",
});

// 分配用户实体
interface DistributionRole {
    userId: number;
    studentId: string; // 学号
    userName: string;
    email: string;
    createTime: string;
}
const tableData = ref<DistributionRole[]>([]);

// 分页配置 - 使用 TinyVue 自定义分页功能
const pagerConfig = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0,
});

// 弹窗显示控制
const dialogVisible = ref(false);

// 弹窗标题
const dialogTitle = ref("");

// 查询分配用户参数
interface UnDistributionRoleQuery {
    roleId: number;
    userName: string;
    email: string;
}
// 搜索表单数据，包含分页和筛选条件
const unDistributionRoleQuery = ref<UnDistributionRoleQuery>({
    roleId: Number(routeRoleId),
    userName: "",
    email: "",
});
// 未分配用户列表
const unDistributionRoleTableData = ref<DistributionRole[]>([]);

// 分页配置 - 使用 TinyVue 自定义分页功能
const unDistributionRolePagerConfig = ref({
    currentPage: 1,
    pageSize: 10,
    total: 0,
});

// 获取已分配角色的用户
const getDistributionRoleList = async () => {
    try {
        const params = {
            roleId: searchForm.value.roleId,
            userName: searchForm.value.userName,
            email: searchForm.value.email,
            pageNum: pagerConfig.value.currentPage,
            pageSize: pagerConfig.value.pageSize,
        }
        const res = await queryAssignedUserApi(params);
        if (res.success) {
            tableData.value = res.data?.data || [];
            pagerConfig.value.total = res.data?.totalSize || 0;
            console.log("【调试】tableData.value", tableData.value);
            console.log("【调试】pagerConfig.value.total", pagerConfig.value.total);
        }
        else {
            TinyNotify({
                type: "error",
                message: res.message,
                position: "top-right",
            });
        }
    } catch (error: any) {
        TinyNotify({
            type: "error",
            message: error?.message || "请求失败",
            position: "top-right",
        });
    }
}

// 处理搜索
const handleSearch = () => {
    pagerConfig.value.currentPage = 1; // 重置到第一页
    getDistributionRoleList();
};

// 处理页码变化
const handleCurrentChange = (currentPage: number) => {
    pagerConfig.value.currentPage = currentPage;
    getDistributionRoleList();
};

// 处理每页条数变化
const handleSizeChange = (pageSize: number) => {
    pagerConfig.value.pageSize = pageSize;
    pagerConfig.value.currentPage = 1; // 重置到第一页
    getDistributionRoleList();
};

// 重置搜索表单
const resetForm = () => {
    searchForm.value.userName = "";
    searchForm.value.email = "";
    pagerConfig.value.currentPage = 1;
    pagerConfig.value.pageSize = 10;
    getDistributionRoleList();
};

// 删除分配用户
const removeUser = async(row: DistributionRole) => {
    console.log("【调试】删除用户", row);
    try{
        // 传递参数
        const params = {
            roleId: Number(routeRoleId),
            userIds: [row.userId]
        }
        const res = await batchCancelAssignUserApi(params);
        if(res.success){
            TinyNotify({
                type: "success",
                message: "移除用户成功",
                position: "top-right",
            });
            getDistributionRoleList();
        }else{
            TinyNotify({
                type: "error",
                message: res.message,
                position: "top-right",
            });
        }
    }catch(error:any){
        TinyNotify({
            type: "error",
            message: error?.message || "请求失败",
            position: "top-right",
        });
    }
}


// 分配用户
const addUser = () => {
    dialogVisible.value = true;
    dialogTitle.value = "分配用户";
    unDistributionRoleTableData.value = [];
    unDistributionRolePagerConfig.value.total = 0;
    unDistributionRolePagerConfig.value.currentPage = 1;
    unDistributionRolePagerConfig.value.pageSize = 10;
    unDistributionRoleQuery.value.roleId = Number(routeRoleId);
    unDistributionRoleQuery.value.userName = "";
    unDistributionRoleQuery.value.email = "";
    getUnDistributionRoleList();
}
// 关闭弹窗
const closeDialog = () => {
    dialogVisible.value = false;
};

// 加载分配用户列表
const getUnDistributionRoleList = async () => {
    try {
        const params = {
            roleId: unDistributionRoleQuery.value.roleId,
            userName: unDistributionRoleQuery.value.userName,
            email: unDistributionRoleQuery.value.email,
            pageNum: unDistributionRolePagerConfig.value.currentPage,
            pageSize: unDistributionRolePagerConfig.value.pageSize,
        }
        const res = await queryUnassignedUserApi(params);
        if (res.success) {
            unDistributionRoleTableData.value = res.data?.data || [];
            unDistributionRolePagerConfig.value.total = res.data?.totalSize || 0;
        } else {
            TinyNotify({
                type: "error",
                message: res.message,
                position: "top-right",
            });
        }
    } catch (error: any) {
        TinyNotify({
            type: "error",
            message: error?.message || "请求失败",
            position: "top-right",
        });
    }
}

// 处理未分配用户搜索
const handleUnDistributionSearch = () => {
    unDistributionRolePagerConfig.value.currentPage = 1;
    getUnDistributionRoleList();
};

// 重置未分配用户搜索表单
const resetUnDistributionForm = () => {
    unDistributionRoleQuery.value.userName = "";
    unDistributionRoleQuery.value.email = "";
    unDistributionRolePagerConfig.value.currentPage = 1;
    unDistributionRolePagerConfig.value.pageSize = 10;
    getUnDistributionRoleList();
};

// 处理未分配用户分页变化
const handleUnDistributionCurrentChange = (currentPage: number) => {
    unDistributionRolePagerConfig.value.currentPage = currentPage;
    getUnDistributionRoleList();
};

// 处理未分配用户每页条数变化
const handleUnDistributionSizeChange = (pageSize: number) => {
    unDistributionRolePagerConfig.value.pageSize = pageSize;
    unDistributionRolePagerConfig.value.currentPage = 1;
    getUnDistributionRoleList();
};

// 分配单个用户
const assignSingleUser = async (user: DistributionRole) => {
    try {
        const params = {
            roleId: Number(routeRoleId),
            userIds: [user.userId]
        };
        const res = await assignSingleUserApi(params);
        if (res.success) {
            TinyNotify({
                type: "success",
                message: "分配用户成功",
                position: "top-right",
            });
            // 刷新已分配用户列表和未分配用户列表
            getDistributionRoleList();
            getUnDistributionRoleList();
        } else {
            TinyNotify({
                type: "error",
                message: res.message,
                position: "top-right",
            });
        }
    } catch (error: any) {
        TinyNotify({
            type: "error",
            message: error?.message || "分配用户失败",
            position: "top-right",
        });
    }
};


// 页面挂载时获取分配用户列表
onMounted(() => {
    getDistributionRoleList();
    menuStore.addTab({
        title: '分配用户',
        name: 'DistributionRole',
        withClose: true,
    })
})

</script>

<style scoped>
/* 页面主容器样式 */
.role-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f4f8fc;
    /* 更浅的蓝色背景 */
    padding: 24px 24px 0 24px;
    box-sizing: border-box;
    overflow-y: hidden;
    /* 禁用滚动条 */
}

/* 搜索区样式 */
.role-search {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    background-color: #e6f0ff;
    /* 浅蓝色背景 */
    height: 56px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(64, 158, 255, 0.08);
    border: 1.5px solid #b3d8ff;
    padding: 0 24px;
}

/* 搜索表单输入框和下拉框样式 */
.role-search .tiny-input,
.role-search .tiny-base-select {
    width: 220px;
    border-radius: 8px;
    border: 1.5px solid #b3d8ff;
    transition: border 0.2s;
}

.role-search .tiny-input:focus,
.role-search .tiny-base-select:focus {
    border-color: #409eff;
}

.role-search .tiny-form--inline {
    display: flex;
    align-items: center;
    height: 100%;
}

.role-search .tiny-form-item {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    height: 100%;
    margin-right: 24px;
}

.role-search .tiny-form-item:last-child {
    margin-right: 0;
}

.role-search .tiny-form-item__label {
    display: flex;
    align-items: center;
    height: 100%;
    font-weight: 500;
    color: #2366b8;
}

/* 操作按钮区样式 */
.role-button {
    margin: 20px 0 12px 0;
    display: flex;
    gap: 16px;
}

.role-button .tiny-button {
    border-radius: 24px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.08);
    background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
    color: #fff;
    border: none;
    transition: background 0.2s, box-shadow 0.2s, filter 0.2s;
}

.role-button .tiny-button:hover {
    filter: brightness(1.12);
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.16);
}

/* 表格区样式 */
.role-table {
    background-color: #fff;
    padding: 24px 24px 12px 24px;
    border-radius: 16px;
    box-shadow: 0 2px 16px rgba(64, 158, 255, 0.1);
    flex: 1;
    margin-bottom: 24px;
}

.role-table .tiny-grid__header th {
    font-weight: bold;
    background: #e6f0ff;
    color: #2366b8;
    border-bottom: 2px solid #b3d8ff;
}

.role-table .tiny-grid__row {
    transition: background 0.2s;
    height: 48px;
}

.role-table .tiny-grid__row:hover {
    background: #f0f7ff;
}

.role-table .tiny-button {
    border-radius: 18px;
    font-size: 13px;
    padding: 4px 18px;
    font-weight: 500;
    background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
    color: #fff;
    border: none;
    margin-right: 8px;
    transition: filter 0.2s;
}

.role-table .tiny-button[type="danger"] {
    background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
}

.role-table .tiny-button:last-child {
    margin-right: 0;
}

.role-table .tiny-button:hover {
    filter: brightness(1.1);
}

/* 更多按钮样式，与编辑删除按钮保持一致 */
.role-table .tiny-dropdown {
    display: inline-block;
    margin-left: 8px;
}

.role-table .tiny-dropdown .tiny-button {
    border-radius: 18px;
    font-size: 13px;
    padding: 4px 18px;
    font-weight: 500;
    background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
    color: #fff;
    border: none;
    transition: filter 0.2s;
}

.role-table .tiny-dropdown .tiny-button:hover {
    filter: brightness(1.1);
}

/* 弹窗表单布局样式 */
.role-form .tiny-form-item {
    width: 100%;
    margin-bottom: 16px;
}

.role-form .tiny-form-item:last-of-type {
    margin-bottom: 0;
}

.role-form .tiny-select,
.role-form .tiny-input,
.role-form .tiny-base-select {
    width: 100%;
    border-radius: 8px;
    border: 1.5px solid #b3d8ff;
    transition: border 0.2s;
}

.role-form .tiny-select:focus,
.role-form .tiny-input:focus,
.role-form .tiny-base-select:focus {
    border-color: #409eff;
}

.tiny-button+.tiny-button {
    margin-left: 12px;
}

/* 弹窗表单按钮优化 */
.role-form .tiny-button {
    border-radius: 20px;
    min-width: 90px;
    font-weight: 600;
    background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
    color: #fff;
    border: none;
    transition: filter 0.2s;
}

.role-form .tiny-button[type="primary"] {
    background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
    border: none;
}

.role-form .tiny-button[type="primary"]:hover {
    filter: brightness(1.1);
}

.role-form .tiny-button:not([type="primary"]):hover {
    filter: brightness(1.08);
}

/* 优化弹窗表单输入框和下拉框宽度，仅影响弹窗 */
.role-form .tiny-input,
.role-form .tiny-base-select,
.role-form .tiny-select,
.role-form .tiny-textarea {
    width: 320px;
    min-width: 200px;
    max-width: 100%;
}

/* 自定义分页样式 */
.role-pager {
    margin-top: 16px;
    padding: 16px 0;
    border-top: 1px solid #e6f0ff;
    position: relative;
}

:deep(.tiny-pager) {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
}

:deep(.tiny-pager__total) {
    position: absolute;
    left: 30px;
    color: #606266;
    font-size: 14px;
    margin-right: 0;
}

:deep(.tiny-pager__sizes) {
    margin: 0 16px;
}

:deep(.tiny-pager__sizes .tiny-select) {
    width: 110px;
}

:deep(.tiny-pager__btn) {
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    background: #fff;
    color: #606266;
    transition: all 0.2s;
}

:deep(.tiny-pager__btn:hover) {
    border-color: #409eff;
    color: #409eff;
}

:deep(.tiny-pager__btn.is-active) {
    background: #409eff;
    border-color: #409eff;
    color: #fff;
}

:deep(.tiny-pager__jumper) {
    margin-left: 16px;
}

:deep(.tiny-pager__jumper input) {
    width: 50px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
}

/* 自定义分页弹出框样式 */
:global(.custom-pager-popper) {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 弹窗内容样式 */
.dialog-content {
    padding: 20px;
}

.dialog-search {
    margin-bottom: 20px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.dialog-table {
    margin-bottom: 20px;
}

.dialog-pager {
    margin-top: 16px;
    padding: 16px 0;
    border-top: 1px solid #e9ecef;
}

.dialog-footer {
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #e9ecef;
}

/* 弹窗表格样式 */
.dialog-table .tiny-grid__header th {
    font-weight: bold;
    background: #e6f0ff;
    color: #2366b8;
    border-bottom: 2px solid #b3d8ff;
}

.dialog-table .tiny-grid__row {
    transition: background 0.2s;
    height: 48px;
}

.dialog-table .tiny-grid__row:hover {
    background: #f0f7ff;
}

.dialog-table .tiny-button {
    border-radius: 18px;
    font-size: 13px;
    padding: 4px 18px;
    font-weight: 500;
    background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
    color: #fff;
    border: none;
    transition: filter 0.2s;
}

.dialog-table .tiny-button:hover {
    filter: brightness(1.1);
}
</style>