'use strict';
var { jsonpointer } = require('@mpieva/psydb-core-utils');

var createStudyProps = (bag) => {
    var { ids, overrides } = bag;
    var out = {
        'name': 'Foo-Study2',
        'shorthand': 'Foo2',
        'runningPeriod': {
            'start': new Date('2001-01-01T00:00:00Z'),
            'end': null
        },
        'researchGroupIds': [ ids('ChildLab') ],
        'systemPermissions': {
            'accessRightsByResearchGroup': [{
                'researchGroupId': ids('ChildLab'),
                'permission': 'write'
            }],
            'isHidden': false,
        },
        
        'custom': {
            'assistents': [ ids('Test RA ChildLab') ],
            'novels': [],
            'description': '',
        },
    }

    if (overrides) {
        applyOverrides({ target: out, overrides })
    }

    return out;
}

var createRoadmapProps = (bag) => {
    var { ids, overrides } = bag;

    var out = { 'tasks': [
        {
            '_id': null,
            'start': new Date('2020-01-01T00:00:00Z'),
            'end': new Date('2020-03-31T00:00:00Z'),
            'description': 'project prep, study design',
            'status': 'finished',
            'assignedTo': ids('Test RA ChildLab')
        },
        {
            '_id': null,
            'start': new Date('2020-03-01T00:00:00Z'),
            'end': new Date('2020-05-31T00:00:00Z'),
            'description': 'data acquisition & analysis',
            'status': 'ongoing',
            'assignedTo': ids('Test RA ChildLab')
        },
        {
            '_id': null,
            'start': new Date('2020-06-01T00:00:00Z'),
            'end': new Date('2020-07-31T00:00:00Z'),
            'description': 'publication',
            'status': 'planned',
            'assignedTo': ids('Test RA ChildLab')
        },
    ]};

    if (overrides) {
        applyOverrides({ target: out, overrides })
    }

    return out;
}

var applyOverrides = (bag) => {
    var { target, overrides } = bag;
    for (var [ pointer, value ] of Object.entries(overrides)) {
        if (value?.['$$REMOVE'] === true) {
            var tokens = pointer.split('/');
            var leaf = tokens.slice(-1);
            var rpointer = tokens.slice(0, -1);

            var rtarget = jsonpointer.get(target, rpointer, value);
            delete rtarget[leaf];
        }
        else {
            jsonpointer.set(target, pointer, value);
        }
    }
}

module.exports = {
    createStudyProps,
    createRoadmapProps,
}
