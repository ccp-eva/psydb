'use strict';
var createTypedSchemas = require('./create-typed-schemas'),
    instructions = require('./instructions');

var internals = require('../collection/');

var createCollectionMessageSchemas = (
    require('../messages/collection-messages.js')
);

var createStaticMessageSchemas = (
    require('../messages/static')
);

var createAll = ({ records }) => {
    var typedSchemas = createTypedSchemas({ records, instructions });
    
    var collectionSchemas = [
        ...typedSchemas,
        { collection: 'personnel', schemas: {
            gdpr: internals.PersonnelGdprState(),
            scientific: internals.PersonnelScientificState(),
        }},
        { collection: 'systemRole', schemas: {
            state: internals.SystemRoleState(),
        }},
        { collection: 'researchGroup', schemas: {
            state: internals.ResearchGroupState(),
        }},
        { collection: 'experimentOperatorTeam', schemas: {
            state: internals.ExperimentOperatorTeamState(),
        }},
    ];

    var messageSchemas = [
        ...createCollectionMessageSchemas({
            collectionSchemas
        }),
        ...createStaticMessageSchemas()
    ];

    return {
        // TODO: rename collections to records
        collections: collectionSchemas,
        messages: messageSchemas,
    }

    //var schemaTree = createTree(typedSchemas);
    /*return {
        ...schemaTree,
        ...staticSchemas,
        systemRole: {
            state: SystemRoleState({ schemaTree })
        }
    }*/
}

module.exports = createAll;
