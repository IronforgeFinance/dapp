const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

console.log('>> root path is %s', root);

/**
 * @description 找出新词
 */
function filter(newJson, referJson) {
    const referKeys = Object.keys(referJson);
    const newTrans = referKeys.reduce((curr, next) => {
        try {
            !newJson[next]
                ? (curr[next] = referJson[next])
                : (curr[next] = newJson[next]);
            return curr;
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }, {});
    debugger;
    return newTrans;
}

/**
 *
 * @param {string} filepath
 */
function isExist(filepath) {
    return fs.existsSync(path.join(root, filepath));
}

/**
 * @description 转换出新的语言文件
 * @param {Object} temp 参考模版
 * @param {string} filepath 语言文件路径
 */
function translate(filename, temp) {
    /**
     * 大致算法：
     * 检查新文件是否存在。
     * 若存在，找出新词处理。
     * 不存在，直接生成。
     */
    const filepath = `./src/locales/dist/${filename}.js`;
    const output = `./src/locales/${filename}.ts`;

    let result;
    if (isExist(filepath)) {
        const old = require(path.join(root, filepath)).default;
        result = filter(old, temp);
    } else {
        const referKeys = Object.keys(temp);
        result = referKeys.reduce((curr, next) => {
            curr[next] = '';
            return curr;
        }, {});
    }

    fs.writeFileSync(
        path.join(root, output),
        `export default ${JSON.stringify(result, null, '\t')};`,
        { encoding: 'utf-8' },
    );
}

/**
 * @todo 支持命令行
 */
(function main() {
    /** @type {Object} 模版数据 */
    const temp = require(path.join(
        root,
        './src/locales/dist/zh-CN.js',
    )).default;
    translate('en-US', temp);
})();
