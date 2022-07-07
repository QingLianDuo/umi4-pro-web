import React from 'react';
import { history, Link, Outlet } from 'umi';

/**
 * 全局的基础布局
 */
export default function Layout(props: any) {
    console.log('rerender layout', props);
    return (
        <div>
            <Outlet />
        </div>
    );
}
