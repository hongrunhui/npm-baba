#!/usr/bin/env node
'use strict';
/**
 * @file 分析主路径
 */
const path = require('path');
const process = require('process');
const testPath = process.argv[2] || '';
const exec = require('child_process').exec;

if (!testPath) {
    console.log('请输入入口文件的绝对路径地址');
    return;
}
if (testPath === 'i' || testPath === 'install') {
    console.log('正在安装依赖...');
    const installPath = path.resolve(__dirname, './shell/install.sh');

    exec(`sh ${installPath}`, {cwd: __dirname}, (err, std, stderr) => {
        if (!err) {
            console.log(std);
            console.log('安装依赖完成');
        }
        else {
            console.log('依赖安装失败\n', err);
        }
    });
    return;
}
const {FileSystem} = require('tutils/fileSystem');
const fsSync = require('tutils/fileSystemSync');
const fs = new FileSystem();
const chalk = require('chalk');
const runPath = process.cwd();
const astParser = require('./parser');
// const testPath = path.resolve(runPath, './test/cheerio-1.0.0/index.js');
// const testPath = path.resolve(runPath, './test/react/src/React.js');
// const testPath = path.resolve(runPath, './test/mobx-master/src/v4/mobx.ts');
let uniqueId = new Date().getTime();

class Baba {
    constructor() {
        // 关系树🌲
        this.treeMap = {
            name: '开始',
            children: []
        };
        // 合法文件后缀
        this.validSuffix = ['.js', '.ts', '.tsx', '.jsx', '/index.js', '/index.ts', '/index.tsx', '/index.jsx'];
        // 重复依赖缓存，主要用于去重
        this.cache = {};
        console.log(chalk.green('正在分析...'));
    }
    init(src, parentNode = {}) {
        const cache = {};
        // 读取文件内容
        const entryContent = fsSync.readFile(src, 'utf-8');
        // 分析当前所处文件夹
        const basePath = path.dirname(src);
        const name = path.basename(src);
        // 分析依赖
        const deps = astParser(entryContent, name);
        if (parentNode.name === '开始') {
            // 顶层节点信息修改
            parentNode.name = name;
            parentNode.src = src;
        }
        let finalFilePath = null;
        const walk = lib => {
            const libName = lib.value;
            try {
                path.resolve(basePath, libName)
            }
            catch (e) {
            }
            const filePath = path.resolve(basePath, libName);
            let isExitFile = fsSync.existsFile(filePath);
            if (isExitFile) {
                finalFilePath = filePath;
            }
            else {
                this.validSuffix.find(suffix => {
                    const newFilePath = filePath + suffix;
                    const isExitFile = fsSync.existsFile(newFilePath);
                    if (isExitFile) {
                        finalFilePath = newFilePath;
                        return true;
                    }
                });
            }
            if (finalFilePath) {
                const name = path.basename(finalFilePath);
                const node = {
                    name: name,
                    type: 'file',
                    src: finalFilePath,
                    children: [],
                    uniqueId: uniqueId++
                };
                parentNode.children.push(node);
                if (this.cache[finalFilePath] && this.cache[finalFilePath] > 2) {
                    // 已经被缓存过的文件路径，就不再记录
                    return;
                }
                else {
                    this.cache[finalFilePath] = this.cache[finalFilePath] ? ++this.cache[finalFilePath] : 1;
                    this.init(finalFilePath, node);
                }
            }
            else {
                const node = {
                    name: libName,
                    type: lib.type || 'npm',
                    children: [],
                    uniqueId: uniqueId++
                };
                parentNode.children.push(node);
            }
        };
        deps.forEach(walk);
    }
}
const baba = new Baba();
baba.init(testPath, baba.treeMap);
// 保存数据
const viewDataPath = path.resolve(__dirname, 'view/src/data.js');
fs.writeFile(viewDataPath, `var tree = ${JSON.stringify(baba.treeMap, null, 4)}
export default tree;
`);
console.log(
    chalk.green(`分析结果文件生成成功：${viewDataPath}`)
);
console.log(chalk.green('正在启动视图服务...'));
const startPath = path.resolve(__dirname, './shell/start.sh');
exec(`sh ${startPath}`, {cwd: __dirname}, (err, std, stderr) => {
    console.log(chalk.green('启动视图服务成功!'));
    if (!err) {
        console.log(std);
    }
    else {
        console.log('启动视图失败，请重试\n', err);
    }
});

