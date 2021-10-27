import { defineConfig } from 'umi';
import path from 'path';
import routes from './routes';
import pxToViewPort from 'postcss-px-to-viewport';
import PreloadPlugin from '../webpack/preloadPlugin';

export default defineConfig({
    favicon: 'favicon.ico',
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
            mediaQuery: true,
            exclude: /node_modules|antd|(.*)pc.less/i,
        }),
        // pxToViewPort({
        //     viewportWidth: 1920,
        //     viewportUnit: 'vw',
        //     mediaQuery: true,
        //     exclude: /node_modules|antd|(.*)mobile.less/i,
        // }),
    ],
    chainWebpack(config, { webpack }) {
        // Set alias
        config.resolve.alias.set(
            '@iron',
            path.join(__dirname, '../src/components'),
        );

        // Output preload json
        config
            .plugin(PreloadPlugin.name)
            .use(PreloadPlugin)
            .end()
            .plugin(webpack.WatchIgnorePlugin.name)
            .use(
                new webpack.WatchIgnorePlugin([
                    path.resolve(__dirname, '..', 'src/preload*.json'),
                ]),
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
