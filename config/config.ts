import { defineConfig } from 'umi';
import routes from "./routes";
export default defineConfig({
    npmClient: "yarn",
    plugins: [
        "@umijs/plugins/dist/tailwindcss",
        '@umijs/plugins/dist/initial-state',
        '@umijs/plugins/dist/model',
        require.resolve('../plugin/umi-keep-alive'),
    ],
    clientLoader: {},
    model: {},
    initialState: {
        loading: '@/components/Loading',
    },
    routes: routes,
})