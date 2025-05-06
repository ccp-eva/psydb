var debug = require('debug')('psydb:humankind-cronjobs:error');
var { oneLine } = require('common-tags');
var { omit } = require('@mpieva/psydb-core-utils');

class RemapMailError extends Error {
    constructor (bag) {
        var { mail, pair } = bag;
        var message = oneLine`
            Cannot Remap Pair "${pair.key}=${pair.value}"
        `;

        super(message);
        this.name = 'RemapMailError';
        
        debug(`${this.name}: ${message}`);

        this.getExtraInfo = () => ({
            ...bag
        })
    }
}

class RemapPairError extends Error {}

class CreateSubjectError extends Error {
    constructor (bag) {
        var { recordType, props, response } = bag;
        var { lastname, firstname } = props?.gdpr?.custom || {};

        var stringifiedData = JSON.stringify(
            omit({ from: response.data, paths: [
                'data.stack'
            ]})
        );

        var message = oneLine`
            Cannot create subject of type "${recordType}"
            with name "${lastname}, ${firstname}"
            [
                Status: ${response.status};
                Response: ${stringifiedData}
            ]

        `
        super(message);
        this.name = 'CreateSubjectError';

        debug(`${this.name}: ${message}`);
        this.getExtraInfo = () => ({
            ...bag
        })
    }
}
module.exports = {
    RemapMailError,
    RemapPairError,
    CreateSubjectError
}
