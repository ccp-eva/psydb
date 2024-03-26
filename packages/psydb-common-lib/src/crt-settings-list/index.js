'use strict';
var sift = require('sift').default;
var { translate } = require('@mpieva/psydb-common-translations');
var CRTSettings = require('../crt-settings');

var CRTSettingsList = (bag) => {
    var { items } = bag;

    items = items.map(it => (
        it.getRaw ? it : CRTSettings({ data: it })
    ));

    var list = {};

    list.items = () => {
        return items;
    }

    list.filter = (siftFilter) => {
        var out = [];
        var compiledFilter = sift(siftFilter);
        for (var it of items) {
            if (compiledFilter(it.getRaw())) {
                out.push(it)
            }
        }
        return CRTSettingsList({ items: out });
    }

    list.find = (siftFilter) => {
        var out = undefined;
        var compiledFilter = sift(siftFilter);
        for (var it of items) {
            if (compiledFilter(it.getRaw())) {
                out = it;
                break;
            }
        }
        return out;
    }

    list.asOptions = (bag) => {
        var { language } = bag;
        var out = {};
        for (var it of items) {
            out[it.getType()] = translate.crt(language, it.getRaw())
        }
        return out;
    }

    return list;
}

module.exports = CRTSettingsList;
