'use strict';
var { parseDefinedCSV } = require('../common');

var parseLines = (bag) => {
    var { data } = bag;

    var out = parseDefinedCSV({
        csvData: data, definitions, throwUnknown: false
    });
    
    return out;
}

var definitions = [
     //systemType: 'YMDServerSide', // XXX: ???
    {
        csvColumnKey: 'year',
        systemType: 'Integer', props: {},
        pointer: '/timestamp/year',
    },
    {
        csvColumnKey: 'month',
        systemType: 'Integer', props: {},
        pointer: '/timestamp/month',
    },
    {
        csvColumnKey: 'day',
        systemType: 'Integer', props: {},
        pointer: '/timestamp/day',
    },

    { 
        csvColumnKey: 'participant',
        systemType: 'ForeignId',
        props: { collection: 'subject', /* XXX: recordType??? */ },
        pointer: '/subjectData/0/subjectId', // XXX
    },
    {
        csvColumnKey: 'role',
        systemType: 'SaneString',
        pointer: '/subjectData/0/role', // XXX
    },

    {
        csvColumnKey: 'participant_2',
        systemType: 'ForeignId',
        props: { collection: 'subject', /* XXX: recordType??? */ },
        pointer: '/subjectData/1/subjectId', // XXX
    },
    {
        csvColumnKey: 'role_2',
        systemType: 'SaneString',
        pointer: '/subjectData/1/role', // XXX
    },

    { 
        csvColumnKey: 'experiment_name',
        systemType: 'SaneString',
        pointer: '/experimentName'
    },
    {
        csvColumnKey: 'room_or_enclosure',
        systemType: 'SaneString', // XXX
        pointer: '/roomOrEnclosure',
    },
    {
        csvColumnKey: 'comment',
        systemType: 'SaneString', // XXX
        pointer: '/comment'
    },
]

module.exports = parseLines;
