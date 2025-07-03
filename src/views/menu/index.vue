<template>
    <div class="menu-container">
        <!-- 搜索区 -->
        <div class="menu-search">
            <tiny-form label-width="100px" v-model="searchForm" :inline="true"
                style="display: flex; align-items: center;" class="menu-search-form">
                <tiny-form-item label="菜单名" prop="menuName">
                    <tiny-input v-model="searchForm.menuName" placeholder="菜单名"></tiny-input>
                </tiny-form-item>
                <tiny-form-item label="菜单状态" prop="menuName">
                    <tiny-base-select v-model="searchForm.status" placeholder="请选择状态">
                        <tiny-option v-for="item in statusOptions" :key="item.key" :label="item.label"
                            :value="item.value">
                        </tiny-option>
                    </tiny-base-select>
                </tiny-form-item>
                <tiny-form-item>
                    <tiny-button type="primary" @click="getMenuList">查询</tiny-button>
                    <tiny-button @click="resetForm">重置</tiny-button>
                </tiny-form-item>
            </tiny-form>
        </div>

        <!-- 操作区 -->
        <div class="menu-button">
            <tiny-button type="success" @click="addMenu" round size="small">新增</tiny-button>
            <!-- <tiny-button type="info" @click="editMenu" round size="small">编辑</tiny-button>
            <tiny-button type="danger" @click="deleteMenu" round size="small">删除</tiny-button> -->
        </div>

        <!-- 表格区 -->
        <div class="menu-table">
            <tiny-grid :data="menuTree" :tree-config="{ children: 'menuVOList', expandAll: false }" align="center">
                <tiny-grid-column tree-node width="60" label=" "></tiny-grid-column>
                <tiny-grid-column field="menuName" title="菜单名称" width="100"></tiny-grid-column>
                <tiny-grid-column field="icon" title="图标" width="80">
                    <template #default="data">
                        <span v-if="data.row.icon && data.row.icon !== '#'">
                            <svg-icon :icon="data.row.icon" style="width: 24px; height: 24px;" />
                        </span>
                        <span v-else>-</span>
                    </template>
                </tiny-grid-column>
                <tiny-grid-column field="orderNum" title="排序" width="80"></tiny-grid-column>
                <tiny-grid-column field="perms" title="权限标识" width="185">
                    <template #default="data">
                        <span v-if="data.row.perms">{{ data.row.perms }}</span>
                        <span v-else>-</span>
                    </template>
                </tiny-grid-column>
                <tiny-grid-column field="component" title="组件路径" width="185">
                    <template #default="data">
                        <span v-if="data.row.component">{{ data.row.component }}</span>
                        <span v-else>-</span>
                    </template>
                </tiny-grid-column>
                <tiny-grid-column field="menuType" title="菜单类型" width="100">
                    <template #default="data">
                        <span v-if="data.row.menuType === 'M'">目录</span>
                        <span v-else-if="data.row.menuType === 'C'">菜单</span>
                        <span v-else-if="data.row.menuType === 'F'">按钮</span>
                        <span v-else>{{ data.row.menuType }}</span>
                    </template>
                </tiny-grid-column>
                <tiny-grid-column field="status" title="状态" width="100">
                    <template #default="data">
                        <span v-if="data.row.status === '0'" style="color: #67c23a;">正常</span>
                        <span v-else-if="data.row.status === '1'" style="color: #f56c6c;">停用</span>
                        <span v-else>{{ data.row.status }}</span>
                    </template>
                </tiny-grid-column>
                <tiny-grid-column field="visible" title="显示状态" width="100">
                    <template #default="data">
                        <span v-if="data.row.visible === '0'" style="color: #67c23a;">显示</span>
                        <span v-else-if="data.row.visible === '1'" style="color: #f56c6c;">隐藏</span>
                        <span v-else>{{ data.row.visible }}</span>
                    </template>
                </tiny-grid-column>
                <tiny-grid-column title="操作" width="200">
                    <template #default="data">
                        <tiny-button type="primary" size="small" @click="editMenu(data.row)">编辑</tiny-button>
                        <tiny-button type="danger" size="small" @click="deleteMenu(data.row)">删除</tiny-button>
                    </template>
                </tiny-grid-column>
            </tiny-grid>
        </div>

        <!-- 新增/修改菜单弹窗 -->
        <tiny-dialog-box v-model:visible="dialogVisible" :title="dialogTitle" width="700px">
            <tiny-form ref="formRef" :model="formData" :rules="rules" label-width="110px" class="menu-form">
                <!-- 上级菜单 -->
                <div class="form-row">
                    <tiny-form-item label="上级菜单" prop="parentId" class="form-col">
                        <tiny-select v-model="selectedMenu" placeholder="请选择上级菜单" filterable clearable
                            render-type="tree" :tree-op="treeOp" @change="handleMenuChange">
                        </tiny-select>
                    </tiny-form-item>
                    <tiny-form-item label="菜单类型" prop="menuType" class="form-col">
                        <tiny-radio-group v-model="formData.menuType">
                            <tiny-radio label="M">目录</tiny-radio>
                            <tiny-radio label="C">菜单</tiny-radio>
                            <tiny-radio label="F">按钮</tiny-radio>
                        </tiny-radio-group>
                    </tiny-form-item>
                </div>
                <!-- 菜单图标和排序 -->
                <template v-if="formData.menuType !== 'F'">
                    <div class="form-row">
                        <tiny-form-item label="菜单图标" class="form-col">
                            <div class="icon-input-wrapper">
                                <tiny-select v-model="formData.icon" placeholder="请选择图标" class="icon-select" filterable
                                    :formatter="iconFormatter">
                                    <template #prefix v-if="formData.icon">
                                        <svg-icon :icon="formData.icon" style="margin-right: 5px;"></svg-icon>
                                    </template>
                                    <tiny-option v-for="icon in svgIcons" :key="icon" :label="icon" :value="icon">
                                        <div style="display: flex; align-items: center;">
                                            <svg-icon :icon="icon" style="margin-right: 8px;"></svg-icon>
                                            <span>{{ icon }}</span>
                                        </div>
                                    </tiny-option>
                                </tiny-select>
                                <div class="icon-preview" v-if="formData.icon">
                                    <svg-icon :icon="formData.icon"></svg-icon>
                                </div>
                            </div>
                        </tiny-form-item>
                        <tiny-form-item label="显示排序" prop="orderNum" class="form-col">
                            <tiny-input v-model="formData.orderNum" type="number" placeholder="请输入排序"></tiny-input>
                        </tiny-form-item>
                    </div>
                </template>
                <!-- 菜单名称和路由名称 -->
                <div class="form-row">
                    <tiny-form-item label="菜单名称" prop="menuName" class="form-col">
                        <tiny-input v-model="formData.menuName" placeholder="请输入菜单名称"></tiny-input>
                    </tiny-form-item>
                    <template v-if="formData.menuType === 'C'">
                        <tiny-form-item label="路由名称" prop="routeName" class="form-col">
                            <tiny-input v-model="formData.routeName" placeholder="请输入路由名称"></tiny-input>
                        </tiny-form-item>
                    </template>
                </div>
                <!-- 其他字段分组 -->
                <template v-if="formData.menuType !== 'F'">
                    <div class="form-row">
                        <tiny-form-item label="是否外链" prop="isFrame" class="form-col">
                            <tiny-radio-group v-model="formData.isFrame">
                                <tiny-radio :label="1">是</tiny-radio>
                                <tiny-radio :label="0">否</tiny-radio>
                            </tiny-radio-group>
                        </tiny-form-item>
                        <tiny-form-item label="路由地址" prop="path" class="form-col">
                            <tiny-input v-model="formData.path" placeholder="请输入路由地址"></tiny-input>
                        </tiny-form-item>
                    </div>
                </template>
                <template v-if="formData.menuType === 'C'">
                    <div class="form-row">
                        <tiny-form-item label="组件路径" prop="component" class="form-col">
                            <tiny-input v-model="formData.component" placeholder="请输入组件路径"></tiny-input>
                        </tiny-form-item>
                        <tiny-form-item label="权限字符" prop="perms" class="form-col">
                            <tiny-input v-model="formData.perms" placeholder="请输入权限标识"></tiny-input>
                        </tiny-form-item>
                    </div>
                    <div class="form-row">
                        <tiny-form-item label="路由参数" prop="query" class="form-col">
                            <tiny-input v-model="formData.query" placeholder="请输入路由参数"></tiny-input>
                        </tiny-form-item>
                        <tiny-form-item label="是否缓存" prop="isCache" class="form-col">
                            <tiny-radio-group v-model="formData.isCache">
                                <tiny-radio :label="1">缓存</tiny-radio>
                                <tiny-radio :label="0">不缓存</tiny-radio>
                            </tiny-radio-group>
                        </tiny-form-item>
                    </div>
                </template>
                <template v-if="formData.menuType === 'F'">
                    <div class="form-row">
                        <tiny-form-item label="权限字符" prop="perms" class="form-col">
                            <tiny-input v-model="formData.perms" placeholder="请输入权限标识"></tiny-input>
                        </tiny-form-item>
                    </div>
                </template>
                <!-- 显示状态和菜单状态 -->
                <div class="form-row">
                    <tiny-form-item label="显示状态" prop="visible" class="form-col">
                        <tiny-radio-group v-model="formData.visible">
                            <tiny-radio label="0">显示</tiny-radio>
                            <tiny-radio label="1">隐藏</tiny-radio>
                        </tiny-radio-group>
                    </tiny-form-item>
                    <tiny-form-item label="菜单状态" prop="status" class="form-col">
                        <tiny-radio-group v-model="formData.status">
                            <tiny-radio label="0">正常</tiny-radio>
                            <tiny-radio label="1">停用</tiny-radio>
                        </tiny-radio-group>
                    </tiny-form-item>
                </div>
                <!-- 按钮 -->
                <div style="text-align:right;margin-top:10px;">
                    <tiny-button @click="dialogVisible = false">取消</tiny-button>
                    <tiny-button type="primary" @click="handleConfirm">确定</tiny-button>
                </div>
            </tiny-form>
        </tiny-dialog-box>
    </div>
</template>

<script setup lang="ts">
import { getMenuTreeApi, type MenuData, addMenuApi, updateMenuApi, deleteMenuApi } from '@/api/menu'
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
    TinyForm,
    TinyFormItem,
    TinyInput,
    TinyButton,
    TinyOption,
    TinyBaseSelect,
    TinyGrid,
    TinyGridColumn,
    TinyDialogBox,
    TinyRadioGroup,
    TinyRadio,
    TinySelect,
    TinyNotify,
    TinyModal
} from '@opentiny/vue'
import SvgIcon from '@/components/SvgIcon/index.vue'
import icons from '@/components/SelectIcon/icons' // 所有图标

// -----------------------变量------------------------------
const searchForm = ref({
    status: null,
    menuName: ""
}) // 搜索表单
const statusOptions = [
    { key: 1, label: "全部", value: null },
    { key: 2, label: "正常", value: "0" },
    { key: 3, label: "禁用", value: "1" },
]
const menuTree = ref<MenuData[]>([])
// 新增/修改菜单可见
const dialogVisible = ref(false)
// 新增/修改菜单表单
const dialogTitle = ref('添加菜单')
const parentMenuName = ref('主类目')
const formRef = ref()
const selectedMenu = ref<number | null>(null) // 用于绑定选择器，允许绑定 number 或 null
const formData = ref({
    menuId: undefined,
    menuName: '',
    parentId: 0,
    orderNum: undefined,
    path: '',
    component: '',
    query: '',
    routeName: '',
    isFrame: 0,
    isCache: 1,
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: ''
})
const treeOp = ref({ data: [] as any[] })
const rules = reactive({
    menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
    orderNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
    path: [{
        required: true, message: '请输入路由地址', trigger: 'blur', validator: (rule: any, value: any, callback: any) => {
            if (formData.value.menuType !== 'F' && !value) callback(new Error('请输入路由地址'))
            else callback()
        }
    }],
    perms: [{
        required: true, message: '请输入权限标识', trigger: 'blur', validator: (rule: any, value: any, callback: any) => {
            if ((formData.value.menuType === 'C' || formData.value.menuType === 'F') && !value) callback(new Error('请输入权限标识'))
            else callback()
        }
    }]
})
// 所有SVG图标
const svgIcons = ref(icons)
// -----------------------方法------------------------------

// 请求菜单列表
const getMenuList = async () => {
    const res = await getMenuTreeApi(searchForm.value)
    menuTree.value = res.data
    // console.log("菜单树", menuTree.value)
}

// 新增菜单
const addMenu = () => {
    dialogTitle.value = '添加菜单'
    parentMenuName.value = '主类目'
    treeOp.value = convertMenuTreeToTree(menuTree.value)
    // console.log("级联数据", treeOp.value)

    // 重置表单数据
    formData.value = {
        menuId: undefined,
        menuName: '',
        parentId: 0,
        orderNum: undefined,
        path: '',
        component: '',
        query: '',
        routeName: '',
        isFrame: 0,
        isCache: 1,
        menuType: 'M',
        visible: '0',
        status: '0',
        perms: '',
        icon: ''
    }

    // 重置选择器绑定值
    selectedMenu.value = null

    dialogVisible.value = true

    nextTick(() => {
        formRef.value && formRef.value.clearValidate()
    })
}

// 编辑菜单
const editMenu = (menuData: any) => {
    dialogTitle.value = '编辑菜单'
    parentMenuName.value = menuData?.parentName || '主类目'
    treeOp.value = convertMenuTreeToTree(menuTree.value)

    // 清空表单
    formData.value = {
        menuId: undefined,
        menuName: '',
        parentId: 0,
        orderNum: undefined,
        path: '',
        component: '',
        query: '',
        routeName: '',
        isFrame: 0,
        isCache: 1,
        menuType: 'M',
        visible: '0',
        status: '0',
        perms: '',
        icon: ''
    }

    // 确保数据类型正确
    const typedMenuData = {
        ...menuData,
        parentId: menuData.parentId ? Number(menuData.parentId) : 0,
        isFrame: menuData.isFrame !== undefined ? Number(menuData.isFrame) : 0,
        isCache: menuData.isCache !== undefined ? Number(menuData.isCache) : 1,
        orderNum: menuData.orderNum !== undefined ? Number(menuData.orderNum) : undefined
    }

    // 设置表单数据
    Object.assign(formData.value, typedMenuData)
    console.log("编辑表单数据", formData.value)

    // 根据 parentId 设置选择器初始值
    if (formData.value.parentId) {
        // 查找对应的菜单项
        const findMenuItem = (items: any[]): any => {
            for (const item of items) {
                if (item.value === formData.value.parentId) {
                    return item.value 
                }
                if (item.children && item.children.length) {
                    const found = findMenuItem(item.children)
                    if (found) return found
                }
            }
            return null
        }

        selectedMenu.value = findMenuItem(treeOp.value.data)
        console.log("已设置选择器值", selectedMenu.value)
    } else {
        selectedMenu.value = 0 // 当 parentId 为 0 时，直接选中主目录
    }

    dialogVisible.value = true
    nextTick(() => formRef.value && formRef.value.clearValidate())
}

// 确定新增/修改菜单
const handleConfirm = () => {
    if (!formRef.value) return

    formRef.value.validate(async (valid: any) => {
        if (valid) {
            // 处理数据类型转换
            const submitData = {
                ...formData.value,
                // 确保数值类型正确
                orderNum: formData.value.orderNum ? Number(formData.value.orderNum) : undefined,
                isFrame: Number(formData.value.isFrame),
                isCache: Number(formData.value.isCache),
                // 如果parentId为null或undefined，统一转为0
                parentId: formData.value.parentId === null || formData.value.parentId === undefined ? 0 : Number(formData.value.parentId)
            }

            try {
                let res
                if (submitData.menuId) {
                    // 编辑菜单
                    res = await updateMenuApi(submitData as MenuData)
                } else {
                    // 新增菜单
                    res = await addMenuApi(submitData as MenuData)
                }
                console.log("新增/编辑菜单结果", res)
                if (res) {
                    TinyNotify({
                        type: 'success',
                        message: '成功',
                        position: 'top-right'
                    })
                    getMenuList() // 刷新菜单列表
                    dialogVisible.value = false // 关闭弹窗
                } else {
                    TinyNotify({
                        type: 'error',
                        message: '失败',
                        position: 'top-right'
                    })
                }
            } catch (error) {
                console.error("菜单操作请求失败:", error)
                TinyNotify({
                    type: 'error',
                    message: '请求失败，请检查网络或服务器',
                    position: 'top-right'
                })
            }
        } else {
            console.log('表单验证失败')
            return false
        }
    })
}

// 删除菜单
const deleteMenu = (menuData: MenuData) => {
    if (!menuData || !menuData.menuId) {
        TinyNotify({
            type: 'warning',
            message: '请选择要删除的菜单',
            position: 'top-right'
        })
        return
    }

    TinyModal.confirm(`确定删除菜单 "${menuData.menuName}" 吗？`).then(async (action: string) => {
        if (action === 'confirm') {
            try {
                const res = await deleteMenuApi(menuData.menuId as number) // 假设 deleteMenuApi 接收 menuId
                if (res) {
                    TinyNotify({
                        type: 'success',
                        message: '删除成功',
                        position: 'top-right'
                    })
                    getMenuList() // 刷新菜单列表
                } else {
                    TinyNotify({
                        type: 'error',
                        message: '删除失败',
                        position: 'top-right'
                    })
                }
            } catch (error) {
                console.error("删除菜单请求失败:", error)
                TinyNotify({
                    type: 'error',
                    message: '请求失败，请检查网络或服务器',
                    position: 'top-right'
                })
            }
        }
    }).catch((error: any) => {
        // 用户取消或弹窗出现其他问题
        console.log('删除操作已取消或出现错误:', error)
    })
}

// 重置表单
const resetForm = () => {
    searchForm.value = {
        status: null,
        menuName: ""
    }
    getMenuList()
}

// 处理菜单选择变化
const handleMenuChange = (val: any) => {
    console.log("菜单选择变化", val)
    if (val && typeof val === 'object') {
        // 如果是对象，说明选中了菜单项
        formData.value.parentId = Number(val.value)
    } else if (val) {
        // 如果是直接值
        formData.value.parentId = Number(val)
    } else {
        // 如果是清空
        formData.value.parentId = 0
    }
    // console.log("设置父ID为", formData.value.parentId)
}

// 将菜单树转换为树数据
const convertMenuTreeToTree = (menuTree: any[], addRoot = true): { data: any[] } => {
    if (!Array.isArray(menuTree)) return { data: [] }

    if (addRoot) {
        // 主目录节点包含所有菜单作为子节点
        return {
            data: [
                {
                    value: 0,
                    label: "主目录",
                    children: menuTree.map((item: any) => ({
                        value: item.menuId,
                        label: item.menuName,
                        children: convertMenuTreeToTree(item.menuVOList || [], false).data
                    }))
                }
            ]
        }
    } else {
        // 子节点：直接转换不添加主目录
        return {
            data: menuTree.map((item: any) => ({
                value: item.menuId,
                label: item.menuName,
                children: convertMenuTreeToTree(item.menuVOList || [], false).data
            }))
        }
    }
}

// 加载
onMounted(() => {
    getMenuList()
})

// 自定义图标选择器的显示
const iconFormatter = (icon: string) => {
    return icon ? icon : '请选择图标'
}
</script>

<style scoped>
.menu-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f4f8fc; /* 更浅的蓝色背景 */
    padding: 24px 24px 0 24px;
    box-sizing: border-box;
}

.menu-search {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
    background-color: #e6f0ff; /* 浅蓝色背景 */
    height: 56px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(64, 158, 255, 0.08);
    padding: 0 24px;
    border: 1.5px solid #b3d8ff;
}

.menu-search .tiny-input,
.menu-search .tiny-base-select {
    width: 220px;
    border-radius: 8px;
    border: 1.5px solid #b3d8ff;
    transition: border 0.2s;
}
.menu-search .tiny-input:focus,
.menu-search .tiny-base-select:focus {
    border-color: #409eff;
}

.menu-search .tiny-form--inline {
    display: flex;
    align-items: center;
    height: 100%;
}

.menu-search .tiny-form-item {
    display: flex;
    align-items: center;
    margin-bottom: 0;
    height: 100%;
    margin-right: 24px;
}
.menu-search .tiny-form-item:last-child {
    margin-right: 0;
}
.menu-search .tiny-form-item__label {
    display: flex;
    align-items: center;
    height: 100%;
    font-weight: 500;
    color: #2366b8;
}

.menu-button {
    margin: 20px 0 12px 0;
    display: flex;
    gap: 16px;
}
.menu-button .tiny-button {
    border-radius: 24px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.08);
    background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
    color: #fff;
    border: none;
    transition: background 0.2s, box-shadow 0.2s, filter 0.2s;
}
.menu-button .tiny-button:hover {
    filter: brightness(1.12);
    box-shadow: 0 4px 16px rgba(64, 158, 255, 0.16);
}

.menu-table {
    background-color: #fff;
    padding: 24px 24px 12px 24px;
    border-radius: 16px;
    box-shadow: 0 2px 16px rgba(64, 158, 255, 0.10);
    flex: 1;
    margin-bottom: 24px;
}
.menu-table .tiny-grid__header th {
    font-weight: bold;
    background: #e6f0ff;
    color: #2366b8;
    border-bottom: 2px solid #b3d8ff;
}
.menu-table .tiny-grid__row {
    transition: background 0.2s;
    height: 48px;
}
.menu-table .tiny-grid__row:hover {
    background: #f0f7ff;
}
.menu-table .tiny-button {
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
.menu-table .tiny-button[type="danger"] {
    background: linear-gradient(90deg, #ff4d4f 0%, #ff7875 100%);
}
.menu-table .tiny-button:last-child {
    margin-right: 0;
}
.menu-table .tiny-button:hover {
    filter: brightness(1.10);
}

.menu-form .form-row {
    display: flex;
    gap: 28px;
    margin-bottom: 20px;
}
.menu-form .form-col {
    flex: 1;
}
.menu-form .tiny-form-item {
    width: 100%;
    margin-bottom: 0;
}
.menu-form .tiny-select,
.menu-form .tiny-input {
    width: 100%;
    border-radius: 8px;
    border: 1.5px solid #b3d8ff;
    transition: border 0.2s;
}
.menu-form .tiny-select:focus,
.menu-form .tiny-input:focus {
    border-color: #409eff;
}

.icon-input-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
}
.icon-select {
    flex: 1;
}
.icon-preview {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #b3d8ff;
    border-radius: 8px;
    background-color: #f0f7ff;
}

.tiny-button + .tiny-button {
    margin-left: 12px;
}

/* 图标选择器样式优化 */
.tiny-select-dropdown__list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 14px;
    background: #f4f8fc;
}
.tiny-option {
    border-radius: 8px;
    transition: all 0.3s;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.tiny-option:hover {
    background-color: #e6f0ff;
}
.tiny-select__selected-value svg {
    vertical-align: middle;
    margin-right: 8px;
}

/* 弹窗表单按钮优化 */
.menu-form .tiny-button {
    border-radius: 20px;
    min-width: 90px;
    font-weight: 600;
    background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
    color: #fff;
    border: none;
    transition: filter 0.2s;
}
.menu-form .tiny-button[type="primary"] {
    background: linear-gradient(90deg, #409eff 0%, #66b1ff 100%);
    border: none;
}
.menu-form .tiny-button[type="primary"]:hover {
    filter: brightness(1.10);
}
.menu-form .tiny-button:not([type="primary"]):hover {
    filter: brightness(1.08);
}
</style>