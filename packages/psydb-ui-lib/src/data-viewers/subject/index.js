import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    CustomGDPR,
    CustomScientific,
    FullText,
    SystemPermissions
} from '../utility-components';

import TestingPermissions from './testing-permissions';

const labels = {
    '/scientific/state/comment': 'Kommentar',
    '/scientific/state/testingPermissions': 'Teilnahme-Erlaubnis',
    '/scientific/state/systemPermissions': 'Zugriff auf diesen Datensatz für'
}

const [ Subject, SubjectContext ] = createBase();
addComponents(Subject, SubjectContext, labels, [
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
        Component: withPair(SystemPermissions)
    }
]);

export default Subject;
