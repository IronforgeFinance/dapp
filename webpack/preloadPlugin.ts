import fs from 'fs';
import path from 'path';

const hashFileRegex = /([^\s"]*)(\.[\d\w]*)(\.png|jpe?g)/;
const fileRegex = /([^\s"]*)(\.png|jpe?g)/;
const assetsJosnPath = path.resolve(__dirname, '..', 'src/preload.json');
const hashAssetsJosnPath = path.resolve(
    __dirname,
    '..',
    'src/preload.hash.json',
);

function transfer(source, compiled) {
    return source.map((file) => {
        const [fullname, filename, ext] = file.match(fileRegex);
        const hashFile = compiled.find((cfile) => cfile.startsWith(filename));
        return hashFile;
    });
}

export default class PreloadPlugin {
    apply(compiler) {
        if (process.env.MODE === 'compile') {
            /**
             * should output compiled json before emit assets
             * @todo ignore preload.hash.json in this plugin
             * @todo refresh when preload.json changed
             * @todo 产出[name].[hash].[ext]是在编译完成以后，但编译过程中已经把依赖json的内容转化到js，所以js读取到的是
             *       生成preload.hash.json之前的状态，自然的不出结果，目前的解决办法是独立一个compile命令生成文件。
             *       之后才允许build或者start。在umi不太懂咋搞，要继续深入看看，比较花时间。
             */
            compiler.hooks.shouldEmit.tap(
                this.constructor.name,
                (compilation) => {
                    try {
                        if (fs.existsSync(assetsJosnPath)) {
                            const compiledAssets = compilation
                                .getAssets()
                                .map((item) =>
                                    item.name.replace('static/', ''),
                                );
                            const assets = require(assetsJosnPath);

                            const pcAssets = {
                                common: transfer(
                                    assets.pc.common,
                                    compiledAssets,
                                ),
                                pages: Object.entries(assets.pc.pages).reduce(
                                    (prev, [k, v]) => {
                                        prev[k] = transfer(v, compiledAssets);
                                        return prev;
                                    },
                                    {},
                                ),
                            };
                            const mobileAssets = {
                                common: transfer(
                                    assets.mobile.common,
                                    compiledAssets,
                                ),
                                pages: Object.entries(
                                    assets.mobile.pages,
                                ).reduce((prev, [k, v]) => {
                                    prev[k] = transfer(v, compiledAssets);
                                    return prev;
                                }, {}),
                            };

                            // write inputs to src/preload.hash.json
                            fs.writeFileSync(
                                hashAssetsJosnPath,
                                JSON.stringify(
                                    {
                                        pc: pcAssets,
                                        mobile: mobileAssets,
                                    },
                                    null,
                                    '\t',
                                ),
                                { encoding: 'utf-8' },
                            );
                        }
                    } catch (error) {
                        console.warn('preload.json not found');
                    }
                },
            );
        }
    }
}
