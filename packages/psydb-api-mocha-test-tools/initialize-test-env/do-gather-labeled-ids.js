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
        case 'bc_NEW':
            return (
                record.state.shorthand
                //.replace(' Inc.')
                //.replace(/[^a-z]*/gi, '')
            );
        case 'project_NEW':
            return record.state.shorthand;
        case 'site_NEW':
            return record.state.name;

        case 'bc':
            return record.name;
        case 'project':
            return record.name;

        case 'jobOffer':
            return `JO ${record.workingTitle} ${record._id}`;
        case 'user':
            return (
                `U ${record.email} ${record._id}`
                //(record.firstname + record.lastname)
                //.replace(/[^a-z]*/gi, '')
            )
        case 'externalDevices':
            return record.name;
        case 'workgroup':
            return record.name;
        case 'schedule':
            return record.displayName;
        case 'cardpool':
            return record.name;
        case 'extOrgUniversity':
            return record.state.name;
        case 'files':
            return `${record.name} ${record._id}`;
        case 'region':
            return record.name;
        case 'document':
            return record.data.cache.name;
        case 'bcMasterAgreement':
            var { _id, state: { contractDate }} = record;

            contractDate = contractDate.toISOString().replace(/T.*$/, '');
            return `${contractDate} ${_id}`;

        case 'jobApplication':
            var { _id, createdAt, currentState, userData = {}} = record;
            var { firstname, lastname } = userData;
            createdAt = createdAt.toISOString().replace(/T.*$/, '');
            return `JA ${lastname} ${createdAt} ${currentState} ${_id}`;

        case 'userDocument':
            var { _id, type, state } = record;
            var { start, userSnapshot } = state;
            var { lastname } = userSnapshot;

            start = start.toISOString().replace(/T.*$/, '');
            return `${type} ${lastname} ${start} ${_id}`;

        case 'externalUserDoc':
            var { _id, type, state } = record;
            var { start, userSnapshot } = state;
            var { lastname } = userSnapshot;

            start = start.toISOString().replace(/T.*$/, '');
            return `${type} ${lastname} ${start} ${_id}`
        
        case 'instructionAssessmentSheet':
            return record.state.internalName;

        default:
            //return undefined;
            return String(record._id)
    }
}

module.exports = createOneRecordLabel;
module.exports = doGatherLabeledIds;
