import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    CustomGDPR,
    CustomScientific,
    SaneString,
    FullText,
    SystemPermissions,
    createFullUserOrdered
} from '../utility-components';

import TestingPermissions from './testing-permissions';

const labels = {
    '/sequenceNumber': 'ID Nr.',
    '/onlineId': 'Online ID Code',
    '/scientific/state/comment': 'Kommentar',
    '/scientific/state/testingPermissions': 'Teilnahme-Erlaubnis',
}

const [ Subject, SubjectContext ] = createBase();
addComponents(Subject, SubjectContext, labels, [
    {
        cname: 'SequenceNumber',
        path: '/sequenceNumber',
        Component: withPair(SaneString)
    },
    {
        cname: 'OnlineId',
        path: '/onlineId',
        Component: withPair(SaneString)
    },
    {
        cname: 'CustomGDPR',
        path: '/gdpr/state/custom',
        Component: CustomGDPR
    },
    {
        cname: 'CustomScientific',
        path: '/scientific/state/custom',
        Component: CustomScientific
    },
    {
        cname: 'Comment',
        path: '/scientific/state/comment',
        Component: withPair(FullText)
    },
    {
        cname: 'TestingPermissions',
        path: '/scientific/state/testingPermissions',
        Component: withPair(TestingPermissions),
    },
    {
        cname: 'SystemPermissions',
        path: '/scientific/state/systemPermissions',
        Component: SystemPermissions
    },
    {
        cname: 'FullUserOrdered',
        Component: createFullUserOrdered({
            extraFieldComponents: {
                TestingPermissions: withPair(TestingPermissions)
            }
        })
    }
]);

export default Subject;
