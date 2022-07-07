import {UserOutlined} from "@ant-design/icons";
import type {MenuProps} from "antd";
import {history} from "@@/core/history";

type MenuItem = Required<MenuProps>['items'][number];

export function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    menuId?:any,
    parentId?:any,
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        // menuId,
        // parentId
    } as MenuItem;
}
/**
 * 将数组形式的菜单结构转化成树状结构
 * @param arr
 * @param parentId
 */
export function toTree(arr: any[], parentId: number|string) {
    function loop(parentId: number|string) {
        return arr.reduce((acc, cur) => {
            if (cur.parentId === parentId && cur.menuType===0) {
                cur.children = loop(cur.menuId)
                if(cur.children.length===0){
                    cur.children=null;
                }
                acc.push(getItem(cur.title,cur.menuId,<UserOutlined />, cur.children, cur.menuId, cur.parentId));
            }
            return acc
        }, [])
    }
    return loop(parentId)
}

/**
 * 打开菜单
 * @param user
 * @param history
 * @param menuKey
 */
export function openMenuPage(user, history,menuKey){
    const menu = user.authorities.filter(item=>item.menuId==menuKey);
    if(menu.length===1){
        history.push(menu[0].path)
    }
}

/**
 * 根据菜单数据和keyPath生成面包
 * @param menus
 * @param keyPath
 */
export function generateBreadcrumb(menus,keyPath) {
    console.log('keyPath>>>>', keyPath)
   const a = (keyPath||[]).map(key=>{
       const menu = menus.filter(m=>m.menuId==key);
       if(menu&&menu.length===1){
           return menu[0]
       }
       return null;
   })
    console.log('a>>>>', a);
    return a;
}