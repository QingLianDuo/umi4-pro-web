import {useEffect, useState,useMemo} from "react";
import { Link, Outlet, useRouteData, history,  } from 'umi';
import { useLocation,} from 'react-router-dom';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    HomeOutlined,
    ReloadOutlined,
    BellOutlined,
    DownOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, Tabs, Button, Avatar, Badge, Image,  Dropdown, Space} from 'antd';
import './index.less';
import MenuTabBar from "@/components/MenuTabBar";
import classnames from 'classnames';
import {BICI_ADMIN_PREFIX} from '@/constant'
import {toJS} from 'mobx';
import {inject, observer} from "mobx-react";
import {generateBreadcrumb, toTree} from "@/utils/menu";
import ProgressProvider from '@/components/ProgressBar'
import KeepAlive from "react-activation";


const { Header, Content, Footer, Sider } = Layout;


/**
 * 基本布局
 * @param props
 * @constructor
 */
function BaseLayout(props: any) {

    const [collapsed, setCollapsed] = useState(false);
    const [menus, setMenus] = useState([])
    const [originMenus,setOriginMenus]=useState([]);
    const [openKeys, setOpenKeys] = useState([]);
    const [appClass,setAppClass] = useState(classnames(`${BICI_ADMIN_PREFIX}-app`, {
        [`${BICI_ADMIN_PREFIX}-collapse`]: collapsed
    }))

    const location = useLocation();

    const [crumb, setCrumb] = useState([]);
    // 是否全屏
    const [isFull,setIsFull] = useState(false);

    useEffect(()=>{
        setOpenKeys(props.user.keyPathMap.get(props.user.activeMenu));
    },[props.user.activeMenu])

    useEffect(()=>{
        generateMenuTree();
    },[props.user.authorities])

    useEffect(()=>{
        const crumb = generateBreadcrumb(Array.from(props.user.authorities),props.user.keyPathMap.get(props.user.activeMenu));
        setCrumb(toJS(crumb).reverse());
    },[props.user.activeMenu])

    const generateMenuTree = ()=>{
        const t = Array.from(props.user.authorities);
        const r = toTree(t,0);
        setMenus(r);
        setOriginMenus(t);
    }

    const handleMenuClick=({ key, keyPath })=>{
        console.log('keyPath>>>>',key,keyPath);
        const menuItem=originMenus.filter((item)=>{
            return (item.menuId+'')==key;
        });
        if(menuItem.length===1){
            history.replace(menuItem[0].path);
            setOpenKeys(keyPath);
            props.user.setActiveMenu(key);
            props.user.setKeyPathMap(key,keyPath);
        }
    }
    const handleOpenChange=(openKeys:string[])=>{
        setOpenKeys(openKeys);
    }

    const switchCollapse=()=>{
        setCollapsed(!collapsed)
        setAppClass(classnames(`${BICI_ADMIN_PREFIX}-app`, {
            [`${BICI_ADMIN_PREFIX}-collapse`]: !collapsed
        }))
    }

    const onClick=(a)=>{
        console.log('a>>>', a);
    }

    const userMenu = (
        <Menu
            onClick={onClick}
            items={[
                {
                    label: '个人信息',
                    key: 'profile',
                    icon: <UserOutlined />
                },
                {
                    label: '退出登陆',
                    key: 'logout',
                    icon: <LogoutOutlined />
                },
            ]}
        />
    );
    /**
     * 跳转到主页
     */
    const gotoHomePage = ()=>{
        props.user.setActiveMenu('-1');
        history.push('/home');
    }


    return (
        <Layout style={{ height: '100vh' }} className={appClass} >
            <Header className={`${BICI_ADMIN_PREFIX}-header`}>
                <div className={`${BICI_ADMIN_PREFIX}-logo`}>
                    <img src=""/>
                    <span>BICI模版项目</span>
                </div>
                <div className={`${BICI_ADMIN_PREFIX}-header-navs`}>
                    <div className={`${BICI_ADMIN_PREFIX}-header-tools`}>
                        <div className={`${BICI_ADMIN_PREFIX}-header-tools-item`} onClick={switchCollapse}>
                            {collapsed?<MenuUnfoldOutlined />:<MenuFoldOutlined />}
                        </div>
                        <div className={`${BICI_ADMIN_PREFIX}-header-tools-item`} onClick={switchCollapse}>
                            <ReloadOutlined />
                        </div>
                        <Breadcrumb style={{ margin: '13px 0' }}>
                            <Breadcrumb.Item key="home" onClick={gotoHomePage}>
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            {
                                crumb.map((item: any)=>{
                                    return <Breadcrumb.Item key={item.menuId}>{item.title}</Breadcrumb.Item>
                                })
                            }
                        </Breadcrumb>
                    </div>
                    <div className={`${BICI_ADMIN_PREFIX}-header-tools`}>
                        <div className={`${BICI_ADMIN_PREFIX}-header-tools-item`} style={{width: 60, paddingTop:5}}>
                            <Badge count={99} offset={[10, 5]}>
                                <BellOutlined style={{fontSize:24}}/>
                            </Badge>
                        </div>
                        <div className={`${BICI_ADMIN_PREFIX}-header-tools-item`}>
                            <Avatar size={24} style={{ backgroundColor: '#87d068',marginRight:5 }} icon={<UserOutlined />} />
                            <Dropdown overlay={userMenu}>
                                <Space>
                                    管理员,admin
                                    <DownOutlined />
                                </Space>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </Header>
            <Layout className="site-layout">
                <Sider className={`${BICI_ADMIN_PREFIX}-sidebar`} collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)} trigger={null}>
                    <Menu theme="dark"
                          selectedKeys={openKeys}
                          defaultOpenKeys={openKeys}
                          openKeys={openKeys}
                          mode="inline"
                          items={menus}
                          onClick={handleMenuClick}
                          onOpenChange={handleOpenChange}
                    />
                </Sider>
                <Content className={`${BICI_ADMIN_PREFIX}-body`}>
                    <MenuTabBar
                        tabs={props.user.openTabMenus}
                        size={props.user.openTabMenus.size}
                        user={props.user}
                        isFull={isFull}
                        onContentChange={(isFull:boolean)=>{
                            setIsFull(isFull);
                            setAppClass(classnames(`${BICI_ADMIN_PREFIX}-app`, {
                                [`${BICI_ADMIN_PREFIX}-collapse`]: collapsed,
                                [`${BICI_ADMIN_PREFIX}-body-fullscreen`]: isFull,
                            }))
                        }}
                    />
                    <div className={`${BICI_ADMIN_PREFIX}-content`}>
                        <div className={`${BICI_ADMIN_PREFIX}-card`}>
                            <KeepAlive cacheKey={location.pathname} name={location.pathname} saveScrollPosition="screen">
                                <ProgressProvider><Outlet/></ProgressProvider>
                            </KeepAlive>
                        </div>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default inject('user')(observer(BaseLayout));