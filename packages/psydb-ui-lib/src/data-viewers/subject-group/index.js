import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    ForeignId,
    CustomRecordTypeKey,
    FullText,
} from '../utility-components';


const labels = {
    '/subjectType': 'Proband:innen-Typ',
    '/state/locationType': 'Location-Typ',
    '/state/locationId': 'Location',
    '/state/name': 'Bezeichnung',
    '/state/comment': 'Kommentar',
}

const [ SubjectGroup, Context ] = createBase();
addComponents(SubjectGroup, Context, labels, [
    {
        cname:'SubjectType',
        path: '/subjectType',
        Component: withPair((ps) => (
            <CustomRecordTypeKey
                { ...ps }
                props={{ collection: 'subject' }}
            />
        ))
    },
    {
        cname:'LocationType',
        path: '/state/locationType',
        Component: withPair((ps) => (
            <CustomRecordTypeKey
                { ...ps }
                props={{ collection: 'location' }}
            />
        ))
    },
    {
        cname:'LocationId',
        path: '/state/locationId',
        Component: withPair((ps) => (
            <ForeignId
                { ...ps }
                props={{ collection: 'location' }}
            />
        ))
    },
    {
        cname:'Name',
        path: '/state/name'
    },
    {
        cname:'Comment',
        path: '/state/comment',
        Component: withPair(FullText)
    },
]);

export default SubjectGroup;
