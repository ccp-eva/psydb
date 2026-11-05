'use strict';
var { ObjectId } = require('mongodb');

// generates deterministic object ids of the form
// '00000000xxxxxxxxyyyyyyyy' where 'x' is a fixed block per collection
// and 'y' is a per collection counter incremented for every record;
// NOTE: never change or reuse existing blocks, only append new ones
var defaultCollectionBlocks = {
    'helperSet':            '00000001',
    'helperSetItem':        '00000002',
    'customRecordType':     '00000003',
    'researchGroup':        '00000004',
    'systemRole':           '00000005',
    'personnel':            '00000006',
    'externalOrganization': '00000007',
    'externalPerson':       '00000008',
    'location':             '00000009',
    'subject':              '0000000a',
    'subjectGroup':         '0000000b',
    'study':                '0000000c',
    'studyTopic':           '0000000d',
    'experimentVariant':    '0000000e',
    'experimentVariantSetting': '0000000f',
    'experimentOperatorTeam':   '00000010',
    'subjectSelector':      '00000011',
    'ageFrame':             '00000012',
    'reservation':          '00000013',
    'experiment':           '00000014',
    'apiKey':               '00000015',
};

var MAX_COUNTER = 0xffffffff;

var FixedIdGen = (options = {}) => {
    var { collectionBlocks = defaultCollectionBlocks } = options;

    for (var [ collection, block ] of Object.entries(collectionBlocks)) {
        if (!/^[0-9a-f]{8}$/.test(block)) {
            throw new Error(
                `block for "${collection}" must be 8 lowercase hex chars`
            );
        }
    }

    var counters = {};

    var getBlock = (collection) => {
        var block = collectionBlocks[collection];
        if (!block) {
            throw new Error(`no id block defined for "${collection}"`);
        }
        return block;
    }

    var next = (collection) => {
        var block = getBlock(collection);
        var counter = (counters[collection] || 0) + 1;
        if (counter > MAX_COUNTER) {
            throw new Error(`id counter overflow for "${collection}"`);
        }
        counters[collection] = counter;

        var hex = (
            '00000000'
            + block
            + counter.toString(16).padStart(8, '0')
        );
        return new ObjectId(hex);
    }

    var reset = (collection) => {
        if (collection) {
            getBlock(collection);
            delete counters[collection];
        }
        else {
            counters = {};
        }
    }

    return { next, reset };
}

FixedIdGen.defaultCollectionBlocks = defaultCollectionBlocks;

module.exports = FixedIdGen;
