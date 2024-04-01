'use strict';
var { flatten, unflatten } = require('@mpieva/psydb-core-utils');
var { CreateSubjectError } = require('../errors');
var { createSubjectStaticProps, tryCreateSubject } = require('../utils');

var createSubjectsInPsydb = async (context, next) => {
    var { driver, researchGroupIds, mail } = context;

    //try {
    //    await run({ driver, mails, dry: true });
          await run({ driver, mail, researchGroupIds });
    //}
    //catch (e) {
    //    // TODO
    //}

    await next();
}

var run = async (bag) => {
    var { driver, researchGroupIds, mail } = bag;
    var it = mail; // FIXME

    var { seq, adultData, childrenData } = it;
    
    var parentId = await createOneAdult({
        mail, driver, researchGroupIds,
    });

    await createManyChildren({
        mail, driver, researchGroupIds, parentId,
    });
}

var createOneAdult = async (bag) => {
    var { mail, driver, researchGroupIds } = bag;
    var { adultData: data } = mail;
    var recordType = 'humankindAdult';

    var staticProps = createSubjectStaticProps({
        recordType, researchGroupIds,
    });

    var props = unflatten({
        ...staticProps,
        ...data,
    });

    await tryCreateSubject({
        mail, driver, recordType, props
    });
    
    var id = driver.getCache().lastChannelIds.subject;
    return id;
}

var createManyChildren = async (bag) => {
    var { mail, driver, researchGroupIds, parentId } = bag;
    var { childrenData } = mail;
    var recordType = 'humankindChild';

    var staticProps = createSubjectStaticProps({
        recordType,
        researchGroupIds,
        parentIds: [ parentId ],
        siblingCount: (childrenData.length - 1),
    });

    for (var it of childrenData) {
        var props = unflatten({
            ...staticProps,
            ...it,
        });

        await tryCreateSubject({
            mail, driver, recordType, props
        });
    }
}

module.exports = { createSubjectsInPsydb }
