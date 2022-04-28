import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    Custom,
    SaneString,
    SystemPermissions,
} from '../utility-components';

const labels = {
    '/sequenceNumber': 'ID Nr.',
    '/state/systemPermissions': 'Zugriff auf diesen Datensatz für'
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
        Component: withPair(SystemPermissions)
    },

    { cname: 'Custom', path: '/state/custom', Component: Custom },
]);

export default ExternalOrganization;
