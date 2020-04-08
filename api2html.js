let cache = [];
let uniqueId = new Date().getTime();
function circleApi(api, aprentMap) {
    if (!api) {
        return;
    }
    // const keys = [...Object.getOwnPropertyNames(api), ...Object.getOwnPropertyNames(Object.getPrototypeOf(api))];
    const keys = Object.getOwnPropertyNames(api);
    let map = {};
    keys.forEach(key => {
        try {
            map[key] = api[key];
        }
        catch (e) {
        }
    });
    for (let key in api) {
        try {
            map[key] = api[key];
        }
        catch (e) {
        }
    }
    // try {
    //     for (let key of api) {
    //         try {
    //             map[key] = api[key];
    //         }
    //         catch (e) {
    //         }
    //     }
    // }
    // catch (e) {
    //
    // }

    for (let key in map) {
        let currentMap = {
            name: `${aprentMap.name}.${key}`,
            value: map[key],
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
module.exports = function (api, parent) {
    let apiMap = {
        children: [],
        name: parent || "root",
        value: api
    };
    if (api) {
        circleApi(api, apiMap);
        // console.info(parent + ' API:', apiMap);
    }
    return apiMap;
}

