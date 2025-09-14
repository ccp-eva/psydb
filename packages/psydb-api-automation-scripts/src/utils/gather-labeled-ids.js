'use strict';
var { keyBy, arrify } = require('@mpieva/psydb-core-utils');
var { ObjectId } = require('mongodb');
var { entries } = Object;

var gatherLabeledIds = async (bag) => {
    var { db } = bag;
    var ids = {};
    
    var collections;
    var labelDefs;
    var keyedLabelDefs;

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

    getter.addByDriverResponse = async (collection, driverResponses) => {
        driverResponses = arrify(driverResponses);

        var ids = driverResponses.map(it => it.meta._id);
        return await getter.addFromDB({ collection, ids });
    }

    getter.addFromDB = async (bag) => {
        var { collection, ids } = bag;

        var records = await db.collection(collection).find({
            _id: { $in: ids.map(it => new ObjectId(it)) }
        }).toArray();

        getter.addRecords({ collection, records });
    }

    getter.addRecords = (bag) => {
        var { collection: cname, records } = bag;

        if (!ids[cname]) {
            ids[cname] = {};
        }
 
        for (var record of records) {
            var { recordType = undefined } = record;
            
            var definition = keyedLabelDefs[`${cname}__${recordType}`];
            if (definition) {
                var label = createRecordLabel({
                    definition, record, i18n: { language: 'en' }
                });
                label = `${recordType} ${record.sequenceNumber} ${label}`
                ids[cname][label] = record._id;
            }
            else {
                var label = createRecordLabelManual(cname, record);
                ids[cname][label] = record._id;
            }
        }
    }

    collections = await db.listCollections({
        name: { $nin: [
            'mqMessageQueue', 'mqMessageHistory', 'rohrpostEvents'
        ]}
    }).map(it => it.name);

    labelDefs = await db.collection('customRecordType').aggregate([
        { $project: {
            _id: true,
            collection: true,
            recordType: '$type',
            definition: '$state.recordLabelDefinition'
        }}
    ]).toArray();

    keyedLabelDefs = keyBy({ items: labelDefs, createKey: (it) => (
        `${it.collection}__${it.recordType}`
    )});

    for await (var cname of collections) {
        var records = await db.collection(cname).find().toArray();
        getter.addRecords({ collection: cname, records });
    }

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

var createRecordLabelManual = (collection, record, options = {}) => {
    switch (collection) {
        case 'customRecordType':
            return `CRT ${record.state.label} ${record._id}`;

        case 'helperSet':
            return `HS ${record.state.label} ${record._id}`;
        case 'helperSetItem':
            return `HSI ${record.state.label} ${record._id}`;

        case 'systemRole':
            return record.state.name;
        case 'researchGroup':
            return record.state.shorthand;
        case 'personnel':
            return (
                `P ${record.gdpr.state.emails[0].email} ${record._id}`
                //(record.firstname + record.lastname)
                //.replace(/[^a-z]*/gi, '')
            )
        case 'studyTopic':
            return record.state.name;
        default:
            //return undefined;
            return String(record._id)
    }
}

module.exports = gatherLabeledIds;
