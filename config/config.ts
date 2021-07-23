import { defineConfig } from 'umi';
import routes from './routes';
export default defineConfig({
    nodeModulesTransform: {
        type: 'none',
    },
    routes,
    fastRefresh: {},
    locale: {
        default: 'en-US',
        baseNavigator: false, // default is true.语言环境的识别按照：localStorage 中 umi_locale 值 > 浏览器检测 > default 设置的默认语言 > 中文
    },
});
