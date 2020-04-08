const babel = require('@babel/core');
module.exports = (code, fileName = 'file.js') => {
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
            filename: 'file.tsx',
            cwd: __dirname,
            presets: ["@babel/preset-react", "@babel/preset-typescript"],
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
