<template>
  <!-- 页面主容器 -->
  <div class="role-container">
    <!-- 搜索区 -->
    <div class="role-search">
      <!-- 搜索表单，包含角色名、角色标识、状态等条件 -->
      <tiny-form label-width="100px" v-model="searchForm" :inline="true" style="display: flex; align-items: center"
        class="role-search-form">
        <tiny-form-item label="角色名称" prop="roleName">
          <tiny-input v-model="searchForm.roleName" placeholder="角色名称"></tiny-input>
        </tiny-form-item>
        <tiny-form-item label="权限标识" prop="roleKey">
          <tiny-input v-model="searchForm.roleKey" placeholder="权限标识"></tiny-input>
        </tiny-form-item>
        <tiny-form-item label="状态" prop="status">
          <tiny-base-select v-model="searchForm.status" placeholder="请选择状态">
            <tiny-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </tiny-base-select>
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
      <tiny-button type="success" @click="addRole" round size="small">新增</tiny-button>
    </div>

    <!-- 表格区：角色列表展示 -->
    <div class="role-table">
      <tiny-grid ref="roleGrid" :data="tableData" align="center" overflow="hidden">
        <tiny-grid-column field="roleId" title="用户编号" width="100px">
        </tiny-grid-column>
        <tiny-grid-column field="roleName" title="角色名称" width="180px">
        </tiny-grid-column>
        <tiny-grid-column field="roleKey" title="权限标识" width="180px">
        </tiny-grid-column>
        <tiny-grid-column field="roleSort" title="显示顺序" width="100px">
        </tiny-grid-column>
        <tiny-grid-column field="status" title="状态" slot="status" width="100px">
          <template #default="{ row }">
            <span v-if="row.status === '0'">正常</span>
            <span v-else-if="row.status === '1'">停用</span>
            <span v-else>未知</span>
          </template>
        </tiny-grid-column>
        <tiny-grid-column field="createTime" title="创建时间" slot="createTime">
        </tiny-grid-column>
        <!-- 操作列自定义渲染：编辑、删除按钮 -->
        <tiny-grid-column title="操作">
          <template #default="scope">
            <!-- 检查是否为管理员角色，如果是则不显示编辑和删除按钮 -->
            <template v-if="!isAdminRole(scope.row)">
              <tiny-button type="primary" size="small" round @click="editRole(scope.row)">
                编辑
              </tiny-button>
              <tiny-button type="danger" size="small" round @click="deleteRole(scope.row)">
                删除
              </tiny-button>
              <tiny-dropdown title="更多" size="small" round>
              <template #dropdown>
                <tiny-dropdown-menu>
                  <tiny-dropdown-item label="分配用户" @click="assignUsers(scope.row)"></tiny-dropdown-item>
                </tiny-dropdown-menu>
              </template>
            </tiny-dropdown>
            </template>
            <template v-else>
              <tiny-tag type="info" size="small">系统角色</tiny-tag>
            </template>
          </template>
        </tiny-grid-column>
      </tiny-grid>

      <!-- 独立的分页器组件 -->
      <tiny-pager :current-page="pagerConfig.currentPage" :page-size="pagerConfig.pageSize" :total="pagerConfig.total"
        :page-sizes="[5, 10, 20]" @current-change="handleCurrentChange" @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper" class="role-pager"></tiny-pager>
    </div>

    <!-- 新增/编辑弹窗表单 -->
    <tiny-dialog-box v-model:visible="dialogVisible" :title="dialogTitle" width="500px">
      <tiny-form ref="formRef" :model="formData" :rules="rules" label-width="110px" class="role-form">
        <tiny-form-item label="角色名称" prop="roleName">
          <tiny-input v-model="formData.roleName" placeholder="请输入角色名称"></tiny-input>
        </tiny-form-item>
        <tiny-form-item label="角色标识" prop="roleKey">
          <tiny-input v-model="formData.roleKey" placeholder="请输入角色标识"></tiny-input>
        </tiny-form-item>
        <tiny-form-item label="排序" prop="roleSort">
          <tiny-input v-model="formData.roleSort" type="number" placeholder="请输入排序"></tiny-input>
        </tiny-form-item>
        <tiny-form-item label="数据范围" prop="dataScope">
          <tiny-base-select v-model="formData.dataScope" placeholder="请选择数据范围">
            <tiny-option v-for="item in dataScopeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </tiny-base-select>
        </tiny-form-item>
        <!-- 菜单权限选择 -->
        <tiny-form-item label="菜单权限" prop="menuIds" required>
          <tiny-tree :data="menuTree" show-checkbox node-key="menuId" :default-checked-keys="formData.menuIds"
            @check="handleMenuCheck" style="
              max-height: 300px;
              overflow: auto;
              border: 1px solid #b3d8ff;
              border-radius: 8px;
              padding: 8px;
            " />
        </tiny-form-item>
        <tiny-form-item label="状态" prop="status">
          <tiny-base-select v-model="formData.status" placeholder="请选择状态">
            <tiny-option v-for="item in statusOptions.slice(1)" :key="item.value" :label="item.label"
              :value="item.value" />
          </tiny-base-select>
        </tiny-form-item>
        <tiny-form-item label="备注" prop="remark">
          <tiny-input v-model="formData.remark" type="textarea" placeholder="请输入备注"></tiny-input>
        </tiny-form-item>
        <div style="text-align: center; margin-top: 20px; margin-bottom: 20px">
          <tiny-button @click="closeDialog">取消</tiny-button>
          <tiny-button type="primary" @click="handleConfirm">确定</tiny-button>
        </div>
      </tiny-form>
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
// 引入角色相关API
import {
  queryRoleApi,
  addRoleApi,
  updateRoleApi,
  deleteRoleApi,
} from "@/api/role";
// 引入类型定义
import type { Role, RoleQuery } from "@/types/roletype";
import { getMenuTreeApi } from "@/api/menu";
import router from "@/router";
// 从内存中获取用户信息
import type { UserInfo } from "@/types/userInfo";
import { storage } from "@/utils/storage";
const userInfo = storage.get<UserInfo>("userInfo");
const isAdmin = userInfo?.isAdmin;


// 搜索表单数据，包含分页和筛选条件
const searchForm = ref<RoleQuery>({
  roleName: "",
  roleKey: "",
  status: "",
});

// 角色状态选项
const statusOptions = [
  { label: "全部", value: "" },
  { label: "正常", value: "0" },
  { label: "停用", value: "1" },
];

// 数据范围选项
const dataScopeOptions = [
  { label: "全部数据权限", value: "1" },
  { label: "自定义数据权限", value: "2" },
  { label: "本部门数据权限", value: "3" },
  { label: "本部门及以下数据权限", value: "4" },
  { label: "仅本人数据权限", value: "5" },
];

// 表格数据
const tableData = ref<Role[]>([]);

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
// 表单ref
const formRef = ref();
// 表单数据，新增/编辑共用
const formData = ref<Role>({
  roleId: undefined,
  roleName: "",
  roleKey: "",
  roleSort: 1,
  dataScope: "1",
  status: "0",
  delFlag: "0",
  createBy: "",
  createTime: new Date().toISOString(),
  updateBy: "",
  updateTime: new Date().toISOString(),
  remark: "",
  menuIds: [],
});

// 表单校验规则
const rules = reactive({
  roleName: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" },
  ],
  roleKey: [
    { required: true, message: "请输入角色标识", trigger: "blur" },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "只能包含字母、数字和下划线",
      trigger: "blur",
    },
  ],
  roleSort: [
    { required: true, message: "请输入排序", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 9999,
      message: "排序必须在0-9999之间",
      trigger: "blur",
    },
  ],
  dataScope: [{ required: true, message: "请选择数据范围", trigger: "change" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
  menuIds: [{ required: true, message: "请选择菜单权限", trigger: "change" }],
});

// 时间格式化函数
function formatDate(val: string | null) {
  if (!val) return "";
  return val.replace("T", " ").slice(0, 19);
}

// 在 script setup 里声明 ref
const roleGrid = ref();

// 获取角色列表 - 优化后的分页逻辑
const getRoleList = async () => {
  try {
    const params = {
      roleName: searchForm.value.roleName,
      roleKey: searchForm.value.roleKey,
      status: searchForm.value.status,
      pageNum: pagerConfig.value.currentPage,
      pageSize: pagerConfig.value.pageSize,
    };

    const res = await queryRoleApi(params);
    if (res.success) {
      tableData.value = res.data?.data || [];
      pagerConfig.value.total = res.data?.totalSize || 0;

      // 调试输出
      // console.log("【调试】接口返回总条数:", res.data?.totalSize);
      // console.log("【调试】当前页码:", pagerConfig.value.currentPage);
      // console.log("【调试】每页条数:", pagerConfig.value.pageSize);
      // console.log("【调试】当前表格数据条数:", tableData.value.length);
      // console.log("res:", res);

      // 如果当前页没有数据且不是第一页，则跳转到上一页
      if (tableData.value.length === 0 && pagerConfig.value.currentPage > 1) {
        pagerConfig.value.currentPage--;
        await getRoleList();
      }
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
};

// 处理搜索
const handleSearch = () => {
  pagerConfig.value.currentPage = 1; // 重置到第一页
  getRoleList();
};

// 处理页码变化
const handleCurrentChange = (currentPage: number) => {
  pagerConfig.value.currentPage = currentPage;
  getRoleList();
};

// 处理每页条数变化
const handleSizeChange = (pageSize: number) => {
  pagerConfig.value.pageSize = pageSize;
  pagerConfig.value.currentPage = 1; // 重置到第一页
  getRoleList();
};

// 统一接口调用与错误处理
const handleApi = async (
  apiFunc: Function,
  params: any,
  successMsg: string
) => {
  try {
    const res = await apiFunc(params);
    if (res.success) {
      TinyNotify({
        type: "success",
        message: successMsg,
        position: "top-right",
      });
      dialogVisible.value = false;
      nextTick(() => formRef.value && formRef.value.clearValidate());
      return true;
    } else {
      TinyNotify({
        type: "error",
        message: res.message,
        position: "top-right",
      });
      return false;
    }
  } catch (error: any) {
    TinyNotify({
      type: "error",
      message: error?.message || "请求失败",
      position: "top-right",
    });
    return false;
  }
};

// 新增角色弹窗
const defaultMenuIds = [1, 28, 29, 30, 31];
const addRole = () => {
  dialogTitle.value = "新增角色";
  formData.value = {
    roleId: undefined,
    roleName: "",
    roleKey: "",
    roleSort: 1,
    dataScope: "1",
    status: "0",
    delFlag: "0",
    createBy: "",
    createTime: new Date().toISOString(),
    updateBy: "",
    updateTime: new Date().toISOString(),
    remark: "",
    menuIds: [...defaultMenuIds],
  };
  fetchMenuTree();
  dialogVisible.value = true;
  nextTick(() => formRef.value && formRef.value.clearValidate());
};

// 判断是否为管理员角色
const isAdminRole = (row: Role) => {
  // 根据角色标识判断是否为管理员
  return row.roleKey === 'admin' || row.roleName === '超级管理员';
};

// 修改编辑角色函数，添加权限检查
const editRole = (row: Role) => {
  if (isAdminRole(row)) {
    TinyNotify({
      type: "warning",
      message: "系统角色不允许修改",
      position: "top-right",
    });
    return;
  }
  
  dialogTitle.value = "编辑角色";
  formData.value = {
    ...row,
    menuIds: row.menuIds && row.menuIds.length ? row.menuIds : [...defaultMenuIds],
  };
  fetchMenuTree();
  dialogVisible.value = true;
  nextTick(() => formRef.value && formRef.value.clearValidate());
};

// 新增角色确认
const handleAddRole = async () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const success = await handleApi(addRoleApi, formData.value, "新增成功");
      if (success) {
        getRoleList();
      }
    }
  });
};

// 编辑角色确认
const handleEditRole = async () => {
  if (!formRef.value) return;
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const success = await handleApi(
        updateRoleApi,
        formData.value,
        "编辑成功"
      );
      if (success) {
        await getRoleList();
      }
    }
  });
};

// 弹窗表单确认（新增/编辑）
const handleConfirm = () => {
  if (formData.value.roleId) {
    handleEditRole();
  } else {
    handleAddRole();
  }
};

// 修改删除角色函数，添加权限检查
const deleteRole = (row: Role) => {
  if (isAdminRole(row)) {
    TinyNotify({
      type: "warning",
      message: "系统角色不允许删除",
      position: "top-right",
    });
    return;
  }
  
  if (!row.roleId) {
    TinyNotify({
      type: "warning",
      message: "请选择要删除的角色",
      position: "top-right",
    });
    return;
  }
  
  TinyModal.confirm(`确定删除角色 "${row.roleName}" 吗？`).then(
    async (action: string) => {
      if (action === "confirm") {
        const success = await handleApi(deleteRoleApi, row.roleId, "删除成功");
        if (success) {
          getRoleList();
        }
      }
    }
  );
};

// 重置搜索表单
const resetForm = () => {
  searchForm.value.roleName = "";
  searchForm.value.roleKey = "";
  searchForm.value.status = "";
  pagerConfig.value.currentPage = 1;
  pagerConfig.value.pageSize = 10;
  getRoleList();
};

const menuTree = ref<any[]>([]);

// 获取菜单树（静态数据）
const fetchMenuTree = async () => {
  menuTree.value = [
    {
      menuId: 1,
      label: "首页",
      children: [
        { menuId: 28, label: "仪表盘" },
        { menuId: 29, label: "统计分析" },
        { menuId: 30, label: "报表管理" },
        { menuId: 31, label: "系统监控" },
      ],
    },
    {
      menuId: 2,
      label: "用户管理",
      children: [
        { menuId: 32, label: "用户列表" },
        { menuId: 33, label: "角色管理" },
      ],
    },
  ];
};

// 处理菜单选择
const handleMenuCheck = (checkedKeys: any, checkedNodes: any) => {
  formData.value.menuIds = checkedKeys;
};

// 在 <script setup> 里添加 handleDeleteInDialog 方法
const handleDeleteInDialog = () => {
  if (formData.value.roleId) {
    deleteRole(formData.value);
  }
};

// 页面挂载时获取角色列表
onMounted(() => {
  getRoleList();
  fetchMenuTree();
});

const closeDialog = () => {
  dialogVisible.value = false;
};

// 分配用户功能,跳转到分配用户页面
const assignUsers = (row: Role) => {
  router.push({
    name: 'DistributionRole',
    query: {
      roleId: row.roleId
    }
  })
};

// 数据权限功能
const dataPermissions = (row: Role) => {
  TinyNotify({
    type: "info",
    message: `为角色 "${row.roleName}" 设置数据权限功能开发中...`,
    position: "top-right",
  });
};
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
</style>
