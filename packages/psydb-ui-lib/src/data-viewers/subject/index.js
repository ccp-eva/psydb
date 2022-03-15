import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    CustomGDPR,
    CustomScientific,
    FullText
} from '../utility-components';

import TestingPermissions from './testing-permissions';

const labels = {
    '/scientific/state/comment': 'Kommentar',
    '/scientific/state/testingPermissions': 'Teilnahme-Erlaubnis',
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
]);

export default Subject;
