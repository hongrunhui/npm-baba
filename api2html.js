let cache = [];
let uniqueId = new Date().getTime();
let invalidKey = [];
function circleApi(api, aprentMap) {
    if (!api || (typeof api !== 'object' && typeof api !== 'function')) {
        return;
    }
    let map = {};
    try {
        for (const key of Reflect.ownKeys(api)) {
            if (invalidKey.indexOf(key) === -1) {
                map[key] = api[key];
            }
            else {
                console.log('invalid key: ', key);
            }
        }
        for (let key in map) {
            let fn = '';
            if (typeof map[key] === 'function' && map[key].toString) {
                fn = map[key].toString();
            }
            let currentMap = {
                name: `${aprentMap.name}.${key}`,
                value: map[key],
                fn: fn,
                children: [],
                uniqueId: uniqueId++
            };
            aprentMap.children.push(currentMap);
            if (typeof map[key] !== 'string' && key !== 'constructor' && cache.indexOf(map[key]) === -1) {
                cache.push(map[key]);
                circleApi(map[key], currentMap);
            }
        }
    }
    catch (e) {
        console.log('[API 遍历出错]', e);
    }
}
module.exports = function (api, parent, option) {
    let apiMap = {
        children: [],
        name: parent || "root",
        value: api
    };
    invalidKey = option && option.invalidKey || invalidKey;
    if (api) {
        circleApi(api, apiMap);
    }
    return apiMap;
};

