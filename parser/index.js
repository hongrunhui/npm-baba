const babel = require('@babel/core');
const t = require('babel-types');
const path  = require('path');
var a = 1;
module.exports = (code) => {
    const libs = [];
    const visitor = {
        ExportDeclaration(p) {
            if (p.node && p.node.source) {
                const node = p.node;
                const value = node.source.value;
                libs.push(value);
            }
        },
        ImportDeclaration(p) {
            if (p.node && p.node.source) {
                const node = p.node;
                const value = node.source.value;
                libs.push(value);
            }
        },
        Identifier(node) {
            const section = node.getSource();
            if (section === 'require') {
                // console.log(path.parent);
                const parent = node.parent;
                const args = parent.arguments;
                args.forEach(arg => {
                    const {value} = arg;
                    libs.push(value);
                });
            }
            // const argument = path.node.argument;
            // console.log(section, path.node);
        }
    };
    try {
        const result = babel.transform(code, {
            filename: 'file.ts',
            presets: ["@babel/preset-typescript"],
            plugins: [{
                visitor: visitor
            }]
        });
    }
    catch (e) {
        console.log('解析报错', e);
    }
    return libs;
    // console.log('[result]', result);
};
