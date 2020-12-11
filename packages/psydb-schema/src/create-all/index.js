'use strict';
var createTypedSchemas = require('./create-typed-schemas'),
    instructions = require('./instructions');

var {
    PersonnelGdprState,
    PersonnelScientificState,
} = require('../collection/personnel/');

var {
    SystemRoleState,
} = require('../collection/system-role/');

var createCollectionMessageSchemas = (
    require('../messages/collection-messages.js')
);

var createAll = ({ records }) => {
    var typedSchemas = createTypedSchemas({ records, instructions });
    
    var collectionSchemas = [
        ...typedSchemas,
        { collection: 'personnel', schemas: {
            gdpr: PersonnelGdprState(),
            scientific: PersonnelScientificState(),
        }},
        { collection: 'systemRole', schemas: {
            state: SystemRoleState(),
        }},
    ];

    var messageSchemas = [
        ...createCollectionMessageSchemas({
            collectionSchemas
        }),
        //...createSpecialMessageSchemas()
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
