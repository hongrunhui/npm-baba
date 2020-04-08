#!/usr/bin/env node
'use strict';
/**
 * @file 分析主路径
 */
const path = require('path');
const process = require('process');
const testPath = process.argv[2] || '';
const installName = process.argv[3] || '';
const exec = require('child_process').exec;
const api2html = require('./api2html');
if (!testPath) {
    console.log('请输入npm包的名字');
    return;
}
if (testPath === 'i' || testPath === 'install') {
    console.log('正在安装依赖...');
    const installPath = path.resolve(__dirname, './shell/installApi.sh');

    exec(`sh ${installPath} ${installName}`, {cwd: __dirname}, (err, std, stderr) => {
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

class Mama {
    constructor() {

    }
    init(npmName) {
        if (!npmName) {
            return;
        }
        let apiData = {
            name: npmName,
            type: 'browser'
        };
        try {
            const packages = require(npmName);
            apiData = api2html(packages, npmName)
        }
        catch (e) {
            if (e.toString().indexOf(' Cannot find module ') > -1) {
                console.log(chalk.red('请先安装依赖'));
            }
            return;
        }
        return apiData
    }
}
const baba = new Mama();
const data = baba.init(testPath);
if (!data) {
    return;
}
// 保存数据
const viewDataPath = path.resolve(__dirname, 'view/src/apiData.js');
fs.writeFile(viewDataPath, `var tree = ${JSON.stringify(data, null, 4)}
export default tree;
`);
console.log(
    chalk.green(`分析结果文件生成成功：${viewDataPath}`)
);
console.log(chalk.green('正在启动视图服务...'));
const startPath = path.resolve(__dirname, './shell/startApi.sh');
exec(`sh ${startPath}`, {cwd: __dirname}, (err, std, stderr) => {
    console.log(chalk.green('启动视图服务成功!'));
    if (!err) {
        console.log(std);
    }
    else {
        console.log('启动视图失败，请重试\n', err);
    }
});

