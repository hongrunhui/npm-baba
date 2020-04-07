/**
 * @file 使用vscode打开指定文件
 * @author hongrunhui@gmail.com
 */
const launch = require('launch-editor');
const ws = require('nodejs-websocket');
const chalk = require('chalk');
const kill = require('kill-port');
const port = 8686;
/**
 * 初始化一个websocket服务
 */
function initOpenFile() {
    kill(port, 'tcp')
        .then(() => {
            console.log(chalk.green(`${port}端口清理成功`));
            ws.createServer(socket => {
                console.log(chalk.green('websocket openFile 启动成功'));
                socket.on('text', str => {
                    openFile(str);
                });
                socket.on('error', (e) => {
                });
            }).listen(port);
        })
        .catch(e => {
            console.log('e', e);
        });

}

/**
 * 打开文件
 * @param file 文件绝对路径
 */
function openFile(file = '') {
    launch(
        file,
        'code',
        (fileName, errorMsg) => {
            console.log(fileName, errorMsg);
        }
    );
}

module.exports = initOpenFile;
