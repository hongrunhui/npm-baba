import * as React from 'react';
import c from 'classnames';
import treeData from './data';
import './Tree.less';
class Tree extends React.Component {
    state = {
        currentId: -1
    };
    componentDidMount() {
        console.log('treeData', treeData, this.props);
        this.initWebsocket();
    }
    initWebsocket() {
        this.ws = new WebSocket('ws://localhost:8686/');
        // Web Socket 已连接上，使用 send() 方法发送数据
        this.ws.onopen = function() {
            console.log('[websocket 连接成功]');
        };
        // 这里接受服务器端发过来的消息
        this.ws.onmessage = function(e) {
            // console.log('[发送websocket数据]', e)
        };
        this.ws.onerror = function (e) {
            console.log('[websocket 连接失败]', e);
        };
    }

    getNpmName(fileName) {
        if (fileName) {
            return fileName.split('/')[0];
        }
        return fileName;
    }
    /**
     * 获取文件名前面一层路径
     * @param src 路径
     * @param name 文件名
     */
    getSecondPath(src, name) {
        let result = '';
        const re = new RegExp(`([^/]+)\/${name}$`, 'gi');
        src.replace(re, (_, $1) => {
            result = $1;
        });
        result = result ? `${result} / ` : '';
        return result;
    }
    /**
     * 遍历数据
     * @param treeData 树状JSON
     * @param el 用来保存节点列表
     */
    walkTree(treeData) {
        const vdom = [];
        if (treeData instanceof Array) {
            let list = [];
            for (const item of treeData) {
                list.push(this.walkTree(item));
            }
            if (list.length) {
                const el = (
                    <ul key={'ul'}>
                        {list}
                    </ul>
                );
                vdom.push(el);
            }
        }
        else {
            const node = treeData;
            const liCls = c('li');
            const treeItemCls = c('tree-item');
            const cls = c('tag', {
                'has-child': !!node.children,
                'highlight': node.uniqueId === this.state.currentId
            });
            const el = (
                <li className={liCls} key={node.uniqueId} onClick={e => e.stopPropagation()}>
                    <span
                        title={node.src}
                        className={treeItemCls}
                        onClick={this.handleLiClick.bind(this, node.uniqueId)}>
                        {
                            node.children.length > 0
                                ? <>
                                    <span className={'plus'}>+</span>
                                    <span className={'minus'}>-</span>
                                </>
                                : <span>&nbsp;&nbsp;</span>
                        }
                        <span className={cls}>
                            {node.src && this.getSecondPath(node.src, node.name)}{node.name}
                            {node.type === 'npm' ? <a href={`https://www.npmjs.com/package/${this.getNpmName(node.name)}`} target='__blank' className={'npm'}>npm</a> : null}
                            {
                                node.src && node.type !== 'npm'
                                && <span
                                    onClick={this.handleOpenFile.bind(this, node.src)}
                                    title="打开文件位置"
                                    className={'open-file'}>
                                </span>
                            }
                            {<a href={`https://www.google.com/search?q=${node.name}`} target='__blank' className={'npm'}>search</a>}
                        </span>
                        {
                            this.walkTree(node.children)
                        }
                    </span>
                </li>
            );
            vdom.push(el);
        }
        return vdom;
    }

    handleOpenFile = (src, e) => {
        e.stopPropagation();
        this.ws.send(src);
    };

    handleLiClick = (uniqueId, e) => {
        e.stopPropagation();
        this.setState({
            currentId: uniqueId
        });
        const {currentTarget} = e;
        if (currentTarget.classList.contains('hidden-ul')) {
            currentTarget.classList.remove('hidden-ul')
        }
        else {
            currentTarget.classList.add('hidden-ul')
        }
    };
    render() {
        return (
            <div className="Tree" id="tree">
                {this.walkTree([treeData])}
            </div>
        )
    }
}

export default Tree;
