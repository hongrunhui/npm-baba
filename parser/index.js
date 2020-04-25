const babel = require('@babel/core');
const path = require('path');
const chalk = require('chalk');

/**
 * 获取最近的那个CallExpression节点，主要为了获取他的参数arguments
 * @param node
 * @returns {*}
 */
function getCallExpressionNode(nodePath) {
    if (!nodePath) {
        return null;
    }
    const node = nodePath.node;
    if (node.type === 'CallExpression') {
        return node;
    }
    else {
        return getCallExpressionNode(nodePath.parentPath);
    }
}
module.exports = (code, fileName = 'file.js') => {
    const libs = [];
    const validSuffix = ['.js', '.jsx', '.ts', '.tsx'];
    const visitor = {
        ExportAllDeclaration(p) {
            if (p.node && p.node.source) {
                const node = p.node;
                const value = node.source.value;
                libs.push({
                    value,
                });
            }
        },
        ExportDeclaration(p) {
            if (p.node && p.node.source) {
                const node = p.node;
                const value = node.source.value;
                libs.push({
                    value,
                });
            }
        },
        ImportDeclaration(p) {
            if (p.node && p.node.source) {
                const node = p.node;
                const value = node.source.value;
                libs.push({
                    value,
                });
            }
        },
        Identifier(nodePath) {
            const node = nodePath.node;
            // console.log('==============', node.getSource());
            if (node.name === 'require') {
                if (!node || !nodePath.parentPath) {
                    console.log('sss', node);
                    return;
                }
                const args = nodePath.parentPath.node.arguments;
                if (!args) {
                    // const value = code.slice(node.start, node.end);
                    // libs.push({
                    //     value,
                    //     type: 'tmpl'
                    // });
                    return;
                }
                args.forEach(arg => {
                    const {value} = arg;
                    if (value === 50) {
                        // const value = code.slice(node.type);
                        console.log('222', node.type);
                    }
                    if (value) {
                        libs.push({
                            value
                        });
                    }
                    else {
                        // const value = code.slice(node.start, node.end);
                        // console.log(value);
                        // libs.push({
                        //     value,
                        //     type: 'tmpl'
                        // });
                    }
                });
            }
            // const argument = path.node.argument;
            // console.log(section, path.node);
        }
    };
    try {
        const suffix = path.extname(fileName);
        let presets = [

        ];
        // presets不能同时生效，必须分开
        if (/@flow/.test(code)) {
            presets = ["@babel/preset-flow"];
        }
        else if (suffix === '.jsx') {
            presets = ['@babel/preset-react'];
        }
        else if (['.ts', '.tsx'].indexOf(suffix) > -1) {
            presets = ['@babel/preset-typescript'];
        }
        if (validSuffix.indexOf(suffix) > -1) {
            babel.transform(code, {
                filename: 'file.tsx',
                cwd: __dirname,
                presets: presets,
                plugins: [{
                    visitor: visitor
                }]
            });
        }
        else {
            console.log(chalk.red(`不支持此类文件的解析：${fileName}`));
        }
    }
    catch (e) {
        babel.transform(code, {
            filename: 'file.tsx',
            cwd: __dirname,
            presets: ["@babel/preset-flow"],
            plugins: [{
                visitor: visitor
            }]
        });
    }
    return libs;
    // console.log('[result]', result);
};
