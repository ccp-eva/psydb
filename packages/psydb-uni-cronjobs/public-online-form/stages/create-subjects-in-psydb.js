'use strict';
var { flatten, unflatten } = require('@mpieva/psydb-core-utils');
var { CreateSubjectError } = require('../errors');
var { createSubjectStaticProps, tryCreateSubject } = require('../utils');

var createSubjectsInPsydb = (cliOptions) => async (context, next) => {
    var { dry = false, dryNoCreateSubjects = false } = cliOptions;
    var { driver, researchGroupIds, mail } = context;

    //try {
    //    await run({ driver, mails, dry: true });
    await run({
        driver, mail, researchGroupIds,
        dry: (dry || dryNoCreateSubjects)
    });
    //}
    //catch (e) {
    //    // TODO
    //}

    await next();
}

var run = async (bag) => {
    var { driver, researchGroupIds, mail, dry = false } = bag;
    var it = mail; // FIXME

    var { seq, adultData, childrenData } = it;
    
    var parentId = await createOneAdult({
        mail, driver, researchGroupIds, dry
    });
    

    await createManyChildren({
        mail, driver, researchGroupIds, parentId, dry
    });
}

var createOneAdult = async (bag) => {
    var { mail, driver, researchGroupIds, dry = false } = bag;
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
        mail, driver, recordType, props, dry
    });
    
    var id = driver.getCache().lastChannelIds.subject;
    return id;
}

var createManyChildren = async (bag) => {
    var { mail, driver, researchGroupIds, parentId, dry = false } = bag;
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
            mail, driver, recordType, props, dry
        });
    }
}

module.exports = { createSubjectsInPsydb }
