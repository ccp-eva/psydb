import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    Custom,
    SaneString,
    SystemPermissions,
} from '../utility-components';

const labels = {
    '/sequenceNumber': 'ID Nr.',
}

const [ ExternalOrganization, ExternalOrganizationContext ] = createBase();
addComponents(ExternalOrganization, ExternalOrganizationContext, labels, [
    {
        cname: 'SequenceNumber',
        path: '/sequenceNumber',
        Component: withPair(SaneString)
    },
    {
        cname: 'SystemPermissions',
        path: '/state/systemPermissions',
        Component: SystemPermissions
    },

    { cname: 'Custom', path: '/state/custom', Component: Custom },
]);

export default ExternalOrganization;
