import React from "react";
import {history} from 'umi';
import { Provider } from 'mobx-react';
import stores from './stores';
import { AliveScope, NodeKey } from 'react-activation';
import {queryCurrentUser} from './features/system/apis/account'

// 最大tab菜单个数
const MAX_TABS = 20;

const MobxProvider = (props:any) => <Provider {...stores} {...props} />;

// @ts-ignore
NodeKey.defaultProps.onHandleNode = (node, mark) => {
    // 因异步组件 loaded 后会去掉 LoadableComponent 层，导致 nodeKey 变化，缓存定位错误
    // 故排除对 LoadableComponent 组件的标记，兼容 dynamicImport
    if (node.type && node.type.displayName === 'LoadableComponent') {
        return undefined;
    }

    return mark;
};

// 兼容因使用 rootContainer 导致 access 权限无效问题 (传入 routes 带有 unaccessible 才能成功)
const Wrapper = ({children, ...props}: any) => (
    React.createElement(AliveScope, props, React.cloneElement(children, {	...children.props, ...props }))
);

/**
 * 修改交给 react-dom 渲染时的根组件。
 * rootContainer(lastRootContainer, args)
 * args 包含：
 * routes，全量路由配置
 * plugin，运行时插件机制
 * history，history 实例
 * 比如用于在外面包一个 Provider，
 * @param container
 * @param opts
 */
export function rootContainer(container:any, opts:any) {
    console.log('==============')
    console.log(container)
    const A = React.createElement(Wrapper, null, container);
    return React.createElement(MobxProvider, opts, A);
}

// export function innerProvider(container: any) {
//     return React.createElement(ProgressProvider, null, container);
// }
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
    settings?: any;
    currentUser?: any;
    loading?: boolean;
    fetchUserInfo?: () => Promise<any | undefined>;
}> {
    const fetchUserInfo = async () => {
        try {
            const msg = await queryCurrentUser({});
            return msg;
        } catch (error) {
            history.push('/login');
        }
        return undefined;
    };
    // 如果是登录页面，不执行
    if (history.location.pathname !== '/login') {
        const currentUser = await fetchUserInfo();
        fetch('/api/menu').then(res=>res.json()).then((res) => {
            stores.user.setAuthorities(res);
        })
        return {
            fetchUserInfo,
            currentUser,
            settings: { layout: 'mix' },
        };
    }
    return {
        fetchUserInfo,
        settings: { layout: 'mix' },
    };
}

// /**
//  * 覆写 render。复写这个方法会报错
//  * 比如用于渲染之前做权限校验，
//  * @param oldRender
//  */
// export function render(oldRender) {
//     console.log('render....')
//
//     fetch('/api/auth').then(res=>res.json()).then(auth => {
//         console.log('===========', auth);
//         setTimeout(()=>{
//             if (auth.isLogin) { oldRender() }
//             else {
//                 history.push('/login');
//                 // oldRender()
//             }
//         },10)
//     });
//
//     fetch('/api/menu').then(res=>res.json()).then((res) => {
//         stores.user.setAuthorities(res);
//         // oldRender();
//     })
// }

export function patchRoutes({ routes, routeComponents }: any) {
    console.log('patchRoutes', routes, routeComponents);
}

/**
 * 注：如需动态更新路由，建议使用 patchClientRoutes() ，否则你可能需要同时修改 routes 和 routeComponents。
 * @param routes
 */
export function patchClientRoutes({ routes }: any) {
    console.log('patchClientRoutes', routes, Array.isArray(routes));
}

export function onRouteChange(opts: any) {
    const r = stores.user.authorities.filter((item:any)=>item.path===opts.location.pathname);
    if(r.length===1){
        const menu = r[0] as any;
        if(stores.user.openTabMenus.size<MAX_TABS){
            stores.user.addTabMenu(menu.menuId, {
                id:menu.menuId,
                name: menu.title,
                closeable:true,
            });
        }
    }
}
