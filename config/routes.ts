export default [
    {
        path: '/',
        component: '@/wrappers/BaseLayout',
        routes: [
            {
                path: '/',
                redirect: '/home',
                wrappers: [
                    '@/wrappers/auth',
                ],
            },
            {
                name: '首页',
                path: '/home',
                component: './index',
                wrappers: [
                    '@/wrappers/auth',
                ],
            },
            {
                name: '权限演示',
                path: '/docs',
                component: './docs',
                wrappers: [
                    '@/wrappers/auth',
                ],
            },
            {
                name: ' CRUD 示例',
                path: '/table',
                component: './ComplexTable',
                wrappers: [
                    '@/wrappers/auth',
                ],
            },
            {
                name: '系统管理',
                path: '/system',
                component: null,
                routes:[
                    {
                        name: '用户管理',
                        path: 'user',
                        component: '@/pages/docs',
                    },
                    {
                        name: '菜单管理',
                        path: 'role',
                        component: '@/pages/ComplexTable',
                    },
                    {
                        name: '角色管理',
                        path: 'role',
                        component: '@/pages/ComplexTable',
                    },
                    {
                        name: '字典管理',
                        path: 'dictionary',
                        component: './index',
                    },
                ]
            },
            {
                name: ' 页面丢失',
                path: '/*',
                component: './404',
            },

        ],
    },
    { path: '/login', component: 'Login', exact: true,layout: false },
];