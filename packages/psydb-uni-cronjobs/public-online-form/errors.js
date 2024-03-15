var { oneLine } = require('common-tags');

class RemapMailError extends Error {
    constructor (bag) {
        var { mail, pair } = bag;
        var message = oneLine`
            Cannot Remap Pair "${pair.key}=${pair.value}"
        `
        super(message);
        this.name = 'RemapMailError';

        this.getExtraInfo = () => ({
            ...bag
        })
    }
}

class RemapPairError extends Error {}

class CreateSubjectError extends Error {
    constructor (bag) {
        var { mail, recordType, props, response } = bag;
        var { lastname, firstname } = props?.gdpr?.custom || {};

        var message = oneLine`
            Cannot create subject of type "${recordType}"
            with name "${lastname}, ${firstname}"
            [
                Status: ${response.status};
                Response: ${JSON.stringify(response.data)}
            ]

        `
        super(message);
        this.name = 'CreateSubjectError';

        this.getExtraInfo = () => ({
            ...bag
        })
    }
}
module.exports = {
    RemapMailError,
    RemapPairError,
}
