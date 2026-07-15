'use strict';
var { ObjectId, aggregateToIds } = require('@mpieva/psydb-mongo-adapter');
var { fetchRecordLabelsManual } = require('@mpieva/psydb-db-utils');
var { entries } = Object;

var doGatherLabeledIds = async function (options = {}) {
    var ids = {};
    
    var getter = (...args) => {
        var collection, needle;
        var id = undefined;
        if (
            args.length === 1
            && ( typeof args[0] === 'string' || args[0] instanceof RegExp )
        ) {
            ([ needle ] = args);
            id = findDeep(ids, needle)[0];
        }
        else {
            ([ collection, needle ] = args);
            id = find(ids[collection], needle)[0];
        }

        if (!id) {
            throw new Error(`could not find id for "${needle}"`)
        }
        return new ObjectId(id); // XXX
    }
    getter.all = (maybeCollection, maybeNeedle) => {
        if (maybeCollection) {
            if (maybeNeedle) {
                var out = {};
                for (var [label, recordId] of entries(ids[maybeCollection])) {
                    if (label === maybeNeedle || maybeNeedle.test?.(label)) {
                        out[label] = recordId
                    }
                }
                return out;
            }
            else {
                return ids[maybeCollection];
            }
        }
        else {
            return ids;
        }
    }
    getter.extra = (needle, extraLabel) => {
        if (!ids['__EXTRA__']) {
            ids['__EXTRA__'] = {};
        }

        ids['__EXTRA__'][extraLabel] = getter(needle);
    }

    getter.update = async () => {
        var db = this.getDbHandle();
        var collections = await db.listCollections().map(it => it.name);
        for await (var cname of collections) {
            if ([
                'sequenceNumbers', 'csvImport', 'personnelShadow',
                'mqMessageQueue', 'mqMessageHistory', 'rohrpostEvents',
                
                'file', 'subjectContactHistory',
            ].includes(cname)) {
                continue;
            }
            
            var recordIds = await aggregateToIds({ db, [cname]: [] });
            var related = await fetchRecordLabelsManual(db, {
                [cname]: recordIds
            });

            //ids[cname] = Object.entries(related[cname]).reduce(
            //    (acc, [ id, label ]) => ({
            //        ...acc, [id]: `${label} ${id}`
            //    }), {}
            //);
            ids[cname] = related[cname];
        }
    }

    await getter.update();

    return getter;
}

var findDeep = (ids, needle, options = {}) => {
    var { checkDups = true } = options;

    var out = undefined;
    var outLabel = undefined;
    for (var collectionIds of Object.values(ids)) {
        var [ recordId, label ] = find(collectionIds, needle);

        if (recordId) { 
            if (out && checkDups) {
                throw new Error(`found multiple: "${outLabel}" "${label}"`);
            }
            outLabel = label;
            out = recordId;
        }
        
        if (out && !checkDups) {
            break;
        }
    }

    return [ out, outLabel ];
}

var find = (collectionIds, needle, options = {}) => {
    var { checkDups = true } = options;

    var out = undefined;
    var outLabel = undefined;
    // XXX: label => _id ????
    //for (var [label, recordId] of entries(collectionIds)) {
    for (var [recordId, label] of entries(collectionIds)) {
        if (needle === label || needle.test?.(label)) {
            if (out && checkDups) {
                throw new Error(`found multiple ${outLabel} ${label}`);
            }
            outLabel = label;
            out = recordId;
        }

        if (out && !checkDups) {
            break;
        }
    }

    return [ out, outLabel ];
}

module.exports = doGatherLabeledIds;
