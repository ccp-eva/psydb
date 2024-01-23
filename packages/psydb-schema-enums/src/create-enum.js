'use strict';
var createEnum = (list) => {
    var en = {
        list,
        mapping: {},
        keys: [],
        names: [],
    }

    en.getLabel = (key) => {
        var it = list.find(it => it.key === key);
        return it ? it.name : undefined;
    }
    
    // since the order within the object is technically not
    // deterministic we do it the safe way
    for (var it of list) {
        en.keys.push(it.key);
        en.names.push(it.name);
        en.mapping[it.key] = it.name;
    }

    return en;
};

var createEnumFromMap = (map) => {
    var list = Object.keys(map).map(key => ({
        key: key, name: map[key]
    }));

    return createEnum(list);
}

var createEnumFromKV = ({ keys, names }) => {
    var list = keys.map((it, ix) => ({
        key: it,
        name: names[ix]
    }));

    return createEnum(list);
}

createEnum.fromMap = createEnumFromMap;
createEnum.fromKV = createEnumFromKV;

module.exports = createEnum;
