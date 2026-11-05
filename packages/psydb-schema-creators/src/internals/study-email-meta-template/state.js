'use strict';
var {
    ClosedObject, DefaultArray, DefaultBool, ForeignId,
    SaneString, FullText, URLStringList,
} = require('@mpieva/psydb-schema-fields');
var { SystemPermissions } = require('@mpieva/psydb-schema-fields-special');

var State = (context) => {
    var schema = ClosedObject({
        'templateName': SaneString({ minLength: 1 }),


        'mailSubject': SaneString({ minLength: 1 }),
        'mailSender': SaneString({ minLength: 1 }),
        // NOTE: plain text fallback; not editable in the ui (yet)
        'mailText': FullText({ minLength: 0 }),
        'mailHTML': { type: 'string' }, // XXX
        'mailAttachments': DefaultArray({
            items: ClosedObject({
                'fileId': ForeignId({ collection: 'file' }),
                'label': SaneString({ minLength: 1 }),
            })
        }),
        'mailLinks': URLStringList(),
        // TODO: maybe cache placeholders?

        'isEnabled': DefaultBool(),
        'systemPermissions': SystemPermissions(),
    });
    
    return schema;
}

module.exports = State;
