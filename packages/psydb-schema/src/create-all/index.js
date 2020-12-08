'use strict';
var createTypedSchemas = require('./create-typed-schemas'),
    instructions = require('./instructions');

var {
    PersonnelGdprState,
    PersonnelScientificState,
} = require('../collection/personnel/');

var createAll = ({ records }) => {
    var typedSchemas = createTypedSchemas({ records, instructions });
    return [
        ...typedSchemas,
        { collection: 'personnel', schemas: {
            gdpr: PersonnelGdprState(),
            scientific: PersonnelScientificState(),
        }},
        /*{ collection: 'systemRole', schemas: {
            state: SystemRoleState()
        }},*/
    ];
    
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
