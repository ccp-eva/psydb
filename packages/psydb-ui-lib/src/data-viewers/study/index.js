import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import { Custom } from '../utility-components';
import ExtraDescription from './extra-description';

const labels = {
    '/state/name': 'Name',
}

const [ Study, StudyContext ] = createBase();
addComponents(Study, StudyContext, labels, [
    { cname: 'Name', path: '/state/name' },
    { cname: 'Shorthand', path: '/state/shorthand' },
    { cname: 'Custom', path: '/state/custom', Component: Custom },
    // { prop: 'customGdpr', Component: CustomGdpr }
    // { prop: 'customScientific', Component: CustomScientific }
    {
        cname: 'ExtraDescription',
        path: '/state/custom',
        Component: ExtraDescription
    }
]);

export default Study;
