import { BaseRequest } from '@bici-wui/utils';
import type { RequestInterceptors, RequestConfig } from '@bici-wui/utils';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelTokenSource } from 'axios';

// 封装发送网络请求的方法

type CommonRequestConfig = RequestConfig & {
    data?: any;
    quiet?: boolean;
    url?: string;
};

type CommonResponse<T> = {
    code: number;
    message: string;
    data: T;
    [key: string]: any;
} & AxiosResponse;

/**+++++++++++++++++++获得中航上大APP的请求实例对象，这部分和上面的Request类可以拆分+++++++++++++++++++++++++++++++++++*/
// 封装请求方法
const client = new BaseRequest({
    baseURL: '',
    timeout: 10000,
    maxContentLength: 1000000,
    interceptors: {
        requestInterceptors: (config: any) => {
            console.log('实例请求拦截器', config.data);
            const { quiet = false } = config;
            // if (!quiet) {
            //   loading.start();
            // }
            // 在发送请求之前做些什么
            // const { account } = store.getState();
            // const { token } = account;
            const headers = {
                token: '',
                ...config.headers,
            };
            return { ...config, headers };
            return config;
        },
        responseInterceptors: (result: any) => {
            console.log('实例响应拦截器', result.data);
            // loading.stop();
            const { code, msg, data: _data, ...arg } = result.data;
            const _code = code + '';
            const data = { data: _data, ...arg };
            switch (_code) {
                case '200':
                    return data.total !== undefined ? data : data.data;
                case '40115':
                    // Toast.info(`${code}: ${msg}`, 1.5);
                    // store.dispatch({ type: 'account/logout' });
                    return undefined;
                default:
                    // Toast.info(`${code}: ${msg}`, 1.5);
                    return undefined;
            }
            return result.data;
        },
        responseInterceptorsCatch: (_err: any) => {
            // console.log('++++++++++++++++responseInterceptorsCatch++++++++++++');
            // console.log(err);
            // Toast.info(`系统繁忙，请稍后再试！`, 1.5);
            // loading.stop();
        },
        requestInterceptorsCatch: (_err: any) => {
            // console.log('++++++++++++++++requestInterceptorsCatch++++++++++++');
            // console.log(err);
            // Toast.info(`请求错误，请稍后再试！`, 1.5);
            // loading.stop();
        },
    },
});

export const http = <_D, T = any>(config: CommonRequestConfig) => {
    const { method = 'GET', url } = config;
    console.log('http>>>>>>>>>>>>>');
    if (method === 'get' || method === 'GET') {
        config.params = config.data || {};
        // https://github.com/axios/axios/issues/4658
        // get 请求不能有body
        config.data = undefined;
    }
    console.log(JSON.stringify(config));
    return client.request<T>(config);
};

export default http;