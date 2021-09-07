import { defineConfig } from 'umi';
import path from 'path';
import pxToViewPort from 'postcss-px-to-viewport';
import routes from './routes';

export default defineConfig({
    plugins: ['babel-plugin-styled-components'],
    nodeModulesTransform: {
        type: 'none',
    },
    routes,
    fastRefresh: {},
    extraPostCSSPlugins: [
        pxToViewPort({
            viewportWidth: 750,
            viewportUnit: 'vw',
            mediaQuery: false,
        }),
    ],
    chainWebpack(config, { webpack }) {
        // Set alias
        config.resolve.alias.set(
            '@iron',
            path.join(__dirname, '../src/components'),
        );
    },
    locale: {
        default: 'en-US',
        baseNavigator: false, // default is true.语言环境的识别按照：localStorage 中 umi_locale 值 > 浏览器检测 > default 设置的默认语言 > 中文
    },
    links: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: true,
        },
        {
            href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap',
            rel: 'stylesheet',
        },
    ],
});
