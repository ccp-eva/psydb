import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import { CustomGDPR, CustomScientific } from '../utility-components';

const labels = {
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
]);

export default Subject;
