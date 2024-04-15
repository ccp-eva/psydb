'use strict';
var { CreateSubjectError } = require('../errors');

var tryCreateSubject = async (bag) => {
    var { mail, driver, recordType, props } = bag;

    try {
        await driver.sendMessage({
            type: `subject/${recordType}/create`,
            payload: { props },
        }, { forceTZ: 'UTC' });
    }
    catch (e) {
        if (e.response) {
            throw new CreateSubjectError({
                mail, driver, recordType, props, response: e.response
            });
        }
        else {
            throw e;
        }
    }
}

module.exports = { tryCreateSubject }
