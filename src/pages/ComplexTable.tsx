import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@bicitech-design/pro-components';
import { ProTable, TableDropdown } from '@bicitech-design/pro-components';
import { Button, Dropdown, Menu, Space, Tag, notification } from 'antd';
import { useRef } from 'react';
import { KeepAlive, useActivate, useUnactivate } from 'react-activation'
import {http} from '@/utils/http'

// import request from 'umi-request';
import { inject, observer } from 'mobx-react';
import { BrickWall,Empty } from '@bici-wui/antx';
let i = 0;
const items = Array.from(Array(10), () => ({ id: i++, name: 'jufeng' }));

import '@bicitech-design/pro-table/dist/table.css';

type GithubIssueItem = {
    url: string;
    id: number;
    number: number;
    title: string;
    labels: {
        name: string;
        color: string;
    }[];
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: '标题',
        dataIndex: 'title',
        copyable: true,
        ellipsis: true,
        width: 300,
        tip: '标题过长会自动收缩',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
    },
    {
        disable: true,
        title: '状态',
        dataIndex: 'state',
        filters: true,
        onFilter: true,
        valueType: 'select',
        valueEnum: {
            all: { text: '全部', status: 'Default' },
            open: {
                text: '未解决',
                status: 'Error',
            },
            closed: {
                text: '已解决',
                status: 'Success',
                disabled: true,
            },
            processing: {
                text: '解决中',
                status: 'Processing',
            },
        },
    },
    {
        disable: true,
        title: '标签',
        dataIndex: 'labels',
        search: false,
        renderFormItem: (_, { defaultRender }) => {
            return defaultRender(_);
        },
        render: (_, record) => (
            <Space>
                {record.labels.map(({ name, color }) => (
                    <Tag color={color} key={name}>
                        {name}
                    </Tag>
                ))}
            </Space>
        ),
    },
    {
        title: '创建时间',
        key: 'showTime',
        dataIndex: 'created_at',
        valueType: 'dateTime',
        sorter: true,
        hideInSearch: true,
    },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        valueType: 'dateRange',
        hideInTable: true,
        search: {
            transform: (value) => {
                return {
                    startTime: value[0],
                    endTime: value[1],
                };
            },
        },
    },
    {
        title: '操作',
        valueType: 'option',
        key: 'option',
        search: false,
        render: (text, record, _, action) => [
            <a
                key="editable"
                onClick={() => {
                    action?.startEditable?.(record.id);
                }}
            >
                编辑
            </a>,
            <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
                查看
            </a>,
            <TableDropdown
                key="actionGroup"
                onSelect={() => action?.reload()}
                menus={[
                    { key: 'copy', name: '复制' },
                    { key: 'delete', name: '删除' },
                ]}
            />,
        ],
    },
];

const menu = (
    <Menu>
        <Menu.Item key="1">1st item</Menu.Item>
        <Menu.Item key="2">2nd item</Menu.Item>
        <Menu.Item key="3">3rd item</Menu.Item>
    </Menu>
);

const ComplexTable = (props: any) => {
    const actionRef = useRef<ActionType>();

    useActivate(() => {
        notification.success({
            message: '[Chart] activated'
        })
    })
    useUnactivate(() => {
        notification.warning({
            message: '[Chart] unactivated'
        })
    })
    const handleAddTodo = ()=>{
        props.counter.increase();
    }
    const handleAddTodoAsync = ()=>{
        props.counter.decrease();
    }
    const modifyName=()=>{

    }

    const Card = (prop: any) => (
        <div style={{ boxSizing: 'border-box', border: '1px solid #ccc' }}>
            <div>Index: {prop.index}</div>
            <pre>ID: {prop.id}</pre>
            <div>Column width: {prop.width}</div>
            <div>Column other: {prop.other}</div>
        </div>
    );
    const onDragFinished = (source: any, target: any) => {
        console.log('业务处理毁掉函数');
    };

    return (
        <div>
            <div>{props.counter.count}</div>
            <div>{JSON.stringify(props.user.openTabMenus)}</div>
            <BrickWall
                items={items}
                draggable={true}
                columnGutter={10}
                columnWidth={300}
                onDragFinished={onDragFinished}
                renderItem={() => <Card other="mjk" />}
            />
            <div>
                <Empty type="associatedCockpit">
                    <Button>关联驾驶舱</Button>
                </Empty>
            </div>
            <ProTable<GithubIssueItem>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params = {}, sort, filter) => {
                    console.log('发请求了吗')
                    return http({
                        url: 'https://proapi.azurewebsites.net/github/issues',
                        method: 'get',
                        data: params,
                        withCredentials: true,
                        quiet: true,
                        interceptors: {
                            requestInterceptors: (config) => {
                                console.log('单个拦截器');
                                return config;
                            },
                        },
                    });
                }}
                editable={{
                    type: 'multiple',
                }}
                columnsState={{
                    persistenceKey: 'pro-table-singe-demos',
                    persistenceType: 'localStorage',
                    onChange(value) {
                        console.log('value: ', value);
                    },
                }}
                defaultRowExpandableConfig={{
                    columnCount: 2,
                    rowExpandable: (record) => true,
                    mode: 'all',
                }}
                rowPreviewMode="row"
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                }}
                form={{
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}
                pagination={{
                    pageSize: 5,
                    onChange: (page) => console.log(page),
                }}
                dateFormatter="string"
                headerTitle="高级表格"
                toolBarRender={() => [
                    <Button key="button" icon={<PlusOutlined />} type="primary" onClick={modifyName}>
                        改名字
                    </Button>,
                    <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleAddTodo}>
                        新建Todo
                    </Button>,
                    <Button key="button" icon={<PlusOutlined />} type="primary" onClick={handleAddTodoAsync}>
                        一步新建Todo
                    </Button>,
                    <Dropdown key="menu" overlay={menu}>
                        <Button>
                            <EllipsisOutlined />
                        </Button>
                    </Dropdown>,
                ]}
            />
        </div>
    );
};



const MobxComp = inject('counter','user')(observer(ComplexTable));

const KeepAliceComp = (props: any)=>{
    return (<KeepAlive name="/system/role" saveScrollPosition="screen">
        <MobxComp {...props}/>
    </KeepAlive>);
}

export default MobxComp;