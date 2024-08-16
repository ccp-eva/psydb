import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    ForeignId,
    DefaultBool,
    DateTime,
    CustomRecordTypeKey,
    SaneString,
} from '../utility-components';


const labels = {
    '/createdAt': 'Imported At',
    '/createdBy': 'Imported By',
    '/studyId': 'Study',
    '/type': 'Type',
    '/subjectType': 'Subject Type',
}

const [ CSVImport, Context ] = createBase();
addComponents(CSVImport, Context, labels, [
    { 
        cname: 'CreatedBy',
        path: '/createdBy',
        Component: withPair((ps) => (
            <ForeignId
                { ...ps }
                props={{ collection: 'personnel' }}
            />
        ))
    },
    {
        cname: 'CreatedAt',
        path: '/createdAt',
        Component: withPair(DateTime)
    },
    {
        cname: 'StudyId',
        path: '/studyId',
        Component: withPair((ps) => (
            <ForeignId
                { ...ps }
                props={{ collection: 'study' }}
            />
        ))
    },
    {
        cname: 'Type',
        path: '/type',
        Component: withPair((ps) => (
            asFriendlyType(ps.value)
        ))
    },
    {
        cname: 'SubjectType',
        path: '/subjectType',
        Component: withPair((ps) => (
            <CustomRecordTypeKey
                { ...ps }
                props={{ collection: 'subject' }}
            />
        ))
    }
]);

const asFriendlyType = (type) => ({
    'experiment/wkprc-evapecognition': 'WKPRC EVApeCognition',
    'experiment/wkprc-apestudies-default': 'WKPRC',
}[type] || type)

export default CSVImport;
