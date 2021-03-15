'use strict';
var expect = require('chai').expect;

var {
    customRecordType,
    helperSet,
    helperSetItem,

    experimentOperatorTeam,
    location,
    personnel,
    researchGroup,
    study,
    systemRole
} = require('../src');

var customFieldDefinitions = [
    { key: 'name', type: 'SaneString', props: {}}
]

describe('stub', () => {
    it('does stuff', () => {
        var schema;

        schema = customRecordType.State({ collection: 'location' });
        schema = helperSet.State();
        schema = helperSetItem.State();

        schema = experimentOperatorTeam.State();
        schema = experimentOperatorTeam.RecordMessage({
            op: 'create',
            staticCreateProps: { studyId: { type: 'string' }}
        });
        //console.dir(schema, { depth: null });
        schema = experimentOperatorTeam.RecordMessage({ op: 'patch' });

        schema = location.State({ customFieldDefinitions });
        schema = location.RecordMessage({
            op: 'create', customFieldDefinitions
        });
        schema = location.RecordMessage({
            op: 'patch', customFieldDefinitions
        });

        schema = personnel.subChannelStateSchemaCreators.scientific();
        schema = personnel.subChannelStateSchemaCreators.gdpr();
        schema = personnel.RecordMessage({ op: 'create' });
        schema = personnel.RecordMessage({ op: 'patch' });
        schema = personnel.RecordMessage({ op: 'deleteGdpr' });

        schema = researchGroup.State();
        schema = researchGroup.RecordMessage({ op: 'create' });
        schema = researchGroup.RecordMessage({ op: 'patch' });

        schema = study.State({ customFieldDefinitions });
        schema = study.RecordMessage({ op: 'create' });
        schema = study.RecordMessage({ op: 'patch' });

        schema = systemRole.State();
        schema = systemRole.RecordMessage({ op: 'create' });
        schema = systemRole.RecordMessage({ op: 'patch' });

        console.dir(schema, { depth: null });
    })
})
