/**
 * 标签页组件
 */
import React, {useState, useRef, useMemo, useEffect, useCallback, memo, useLayoutEffect} from "react";
import {Button, Tabs, Menu,Dropdown,notification} from "antd";
import {
    ArrowLeftOutlined,
    CloseCircleOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined,
    FullscreenOutlined,
    MinusCircleOutlined,
    FullscreenExitOutlined,
} from "@ant-design/icons";
import {BICI_ADMIN_PREFIX} from '@/constant'
import {history} from 'umi';
import {openMenuPage} from "@/utils/menu";
import './index.less';


const {TabPane}=Tabs;



type PositionType = 'left' | 'right';




/**
 * 菜单tab
 * @param tabs
 * @param user
 * @constructor
 */
const MenuTabBar=({tabs,user,onContentChange,isFull}: any)=>{

    const [activeKey, setActiveKey] = useState<string>();
    const [panes, setPanes] = useState<any[]>([]);
    const [position, setPosition] = useState<PositionType[]>(['left', 'right']);

    useEffect(()=>{
        const ms:any[] = [];
        tabs.forEach((item: any)=>{
            ms.push({
                id:item.id,
                name:item.name,
                closeable:item.closeable
            })
        })
        setPanes(ms);
        if(tabs.size>10){
            notification.warning({message:`当前打开了${tabs.size}个Tab，打开的Tab菜单太多，会影响页面性能!`})
        }
        if(user.activeMenu==='-1'){
            history.push('/home');
        }
    },[tabs.size])


    /**处理右侧各种按钮开始****/

    // 1、处理全屏
    const fullScreenRef = useRef(false);
    const handleContentChange = ()=>{
        fullScreenRef.current = !fullScreenRef.current;
        onContentChange&&onContentChange(fullScreenRef.current);
    }
    // 2、处理关闭全部tab
    const handleCloseAllTabs = ()=>{
        user.closeAllTabs();
    }
    // 3、处理关闭其他
    const handleCloseOtherTab=()=>{
        user.closeOtherTab();
    }
    // 4、关闭左侧或者右侧tab
    const closeTabByDirection=(d:'left'|'right')=>{
        user.closeTabByDirection(d);
    }
    const handleMenuClick=(menu: any)=>{
        switch (menu.key) {
            case '1':
                handleContentChange();
                break;
            case '2':
                closeTabByDirection('left');
                break;
            case '3':
                closeTabByDirection('right');
                break;
            case '4':
                handleCloseOtherTab();
                break;
            case '5':
                handleCloseAllTabs();
                break;
            default:

        }
    }
    const menu = useMemo(()=>{
        return (
            <Menu
                onClick={handleMenuClick}
                items={[
                    {
                        key: '1',
                        label: "内容全屏",
                        icon: fullScreenRef.current?<FullscreenExitOutlined />:<FullscreenOutlined />
                    },
                    {
                        key: '2',
                        label: "关闭左侧",
                        icon:<ArrowLeftOutlined />,
                    },
                    {
                        key: '3',
                        icon: <ArrowLeftOutlined style={{transform: 'rotate(180deg)'}} />,
                        label: "关闭右侧"
                    },
                    {
                        key: '4',
                        icon: <MinusCircleOutlined/>,
                        label: "关闭其他"
                    },
                    {
                        key: '5',
                        icon: <CloseCircleOutlined />,
                        label: "关闭全部",
                    },
                ]}
            />
        );
    },[fullScreenRef.current])

    const OperationsSlot: Record<PositionType, React.ReactNode> = {
        left: (
            <div className={`${BICI_ADMIN_PREFIX}-header-item`}>
                <span><DoubleLeftOutlined /></span>
            </div>
        ),
        right: (
            <div className={`${BICI_ADMIN_PREFIX}-header-item`}>
                <span><DoubleRightOutlined /></span>
                <span>
                <Dropdown overlay={menu} placement="bottom">
                    <DoubleRightOutlined style={{transform: 'rotate(90deg)'}} />
                </Dropdown>
            </span>
            </div>
        ),
    };
    /**处理右侧各种按钮结束****/

    const slot = useMemo(() => {
        if (position.length === 0) return null;

        return position.reduce(
            (acc, direction) => ({ ...acc, [direction]: OperationsSlot[direction] }),
            {},
        );
    }, [position]);

    const onChange = (newActiveKey: string) => {
        setActiveKey(newActiveKey);
        if(newActiveKey==='-1'){
            history.push('/home');
        }else{
            openMenuPage(user, history, newActiveKey);
        }
        user.setActiveMenu(newActiveKey);
    };
    /**
     * 移除tab标签
     * @param targetKey
     */
    const remove = (targetKey: string) => {

        let newActiveKey = activeKey;
        let lastIndex = -1;
        panes.forEach((pane, i) => {
            if (pane.id == targetKey) {
                lastIndex = i - 1;
            }
        });
        const newPanes = panes.filter(pane => pane.id != targetKey);
        if (newPanes.length && newActiveKey === targetKey) {
            if (lastIndex >= 0) {
                newActiveKey = newPanes[lastIndex].id;
            } else {
                newActiveKey = newPanes[0].id;
            }
        }
        setPanes(newPanes);
        setActiveKey(newActiveKey);
        openMenuPage(user, history, newActiveKey);
        user.removeTabMenu(targetKey);
        user.removeTabMenu(parseInt(targetKey));
        user.setActiveMenu(newActiveKey+'');
    };
    /**
     * 关闭标签页
     * @param targetKey
     * @param action
     */
    const onEdit = (targetKey: string|any, action: 'add' | 'remove') => {
        if (action === 'remove') {
            remove(targetKey);
        }
    };
    return (
        <div className={`${BICI_ADMIN_PREFIX}-tabs`}>
            <Tabs
                hideAdd
                defaultActiveKey={user.activeMenu||'-1'}
                activeKey={user.activeMenu}
                tabBarExtraContent={slot}
                type="editable-card"
                onChange={onChange}
                onEdit={onEdit}
                tabBarGutter={0}
                tabBarStyle={{height: 40}}>
                <TabPane tab="首页" key="-1" closable={false}/>
                {
                    panes.map(({name, id, closeable})=>{
                        return <TabPane tab={name} key={id} closable={closeable}/>
                    })
                }
            </Tabs>
        </div>
    )
}

export default memo(MenuTabBar);