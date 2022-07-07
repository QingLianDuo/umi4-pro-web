import { IApi } from 'umi';
import getAliveScope from "./getAliveScope";

export default (api: IApi) => {
    api.modifyConfig((memo)=>{
        console.log('这是自己的插件')
        return memo;
    });
    // api.modifyRoutes((memo) => {
    //     Object.keys(memo).forEach((id) => {
    //         const route = memo[id];
    //         if(route.path === '/'){
    //             route.path = '/redirect'
    //         }
    //     });
    //     return memo;
    // });
    // api.onGenerateFiles((memo)=>{
    //     api.writeTmpFile({
    //         path: 'plugin-keep-alive/runtime.tsx',
    //         content: getAliveScope(),
    //     });
    // })
};