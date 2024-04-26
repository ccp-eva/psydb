import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    ForeignId,
    DefaultBool,
    DateTime,
} from '../utility-components';


const labels = {
    '/createdAt': 'Imported At',
    '/createdBy': 'Imported By',
    '/studyId': 'Study',
    '/type': 'Type'
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
    }
]);

const asFriendlyType = (type) => ({
    'experiment/wkprc-evapecognition': 'EVApeCognition'
}[type] || type)

export default CSVImport;
