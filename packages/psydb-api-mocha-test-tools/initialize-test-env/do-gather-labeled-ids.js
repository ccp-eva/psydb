'use strict';
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
        return id;
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
            var records = await this.fetchAllRecords(cname);

            ids[cname] = {};
            for (var record of records) {
                var label = createOneRecordLabel(cname, record);
                if (label) {
                    ids[cname][label] = record._id;
                }
            }
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
    for (var [label, recordId] of entries(collectionIds)) {
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

var createOneRecordLabel = (collection, record, options = {}) => {
    switch (collection) {
        case 'study':
            return (
                record.state.shorthand
            );
        case 'subject':
            var { state } = record.gdpr;
            return (
                state.name
                || state.lastname + ', ' + state.firstname
            );
        case 'customRecordType':
            return `${record.collection} ${record.type}`;
        case 'personnel':
            var { _id, gdpr } = record;
            var email = gdpr?.state?.emails?.[0]?.email;
            return email || _id;
        case 'studyConsentForm':
            return record.state.internalName;
        default:
            //return undefined;
            return String(record._id)
    }
}

module.exports = createOneRecordLabel;
module.exports = doGatherLabeledIds;
