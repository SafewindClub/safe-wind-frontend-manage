import request from '@/utils/request';

// 菜单数据类型定义
export interface MenuData {
    menuId?: number
    menuName: string
    parentId: number
    orderNum: number
    path: string
    component: string
    query?: string
    routeName: string
    isFrame: number
    isCache: number
    menuType: string
    visible: string
    status: string
    perms: string
    icon: string
    menuVOList?: MenuData[]
}

// 添加菜单
export const addMenuApi = (data: MenuData) => {
    return request.post("/api/menu/addMenu", {
        menuName: data.menuName,
        parentId: data.parentId,
        orderNum: data.orderNum,
        path: data.path,
        component: data.component,
        query: data.query,
        routeName: data.routeName,
        isFrame: data.isFrame,
        isCache: data.isCache,
        menuType: data.menuType,
        visible: data.visible,
        status: data.status,
        perms: data.perms,
        icon: data.icon
    })
}

// 修改菜单
export const updateMenuApi = (data: MenuData) => {
    return request.post("/api/menu/updateMenu", {
        menuId: data.menuId,
        menuName: data.menuName,
        parentId: data.parentId,
        orderNum: data.orderNum,
        path: data.path,
        component: data.component,
        query: data.query,
        routeName: data.routeName,
        isFrame: data.isFrame,
        isCache: data.isCache,
        menuType: data.menuType,
        visible: data.visible,
        status: data.status,
        perms: data.perms,
        icon: data.icon
    })
}

// 删除菜单
export const deleteMenuApi = (menuId: number) => {
    return request.post(`/api/menu/deleteMenu`,{
        menuId:menuId
    })
}


// 批量删除菜单
// export const batchDeleteMenu = (menuIds: number[]) => {
//     return request.post("/api/menu/batchDeleteMenu",{
//         menuIds:menuIds
//     })
// }

// 获取菜单列表
export const getMenuListApi = (params?: any) => {
    return request.post("/api/menu/queryMenu",{
        status:params.status,
        menuName:params.menuName
    })
}

// // 根据ID获取菜单详情
// export const getMenuById = (menuId: number) => {
//     return request.get(`/api/menu/getMenuById/${menuId}`)
// }

// 获取菜单树结构
export const getMenuTreeApi = (params:any) => {
    return request.post("/api/menu/queryMenuTree",
        {
            status:params.status,
            menuName:params.menuName
        }
    )
}   
   