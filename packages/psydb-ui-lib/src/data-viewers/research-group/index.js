import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    SaneString,
    FullText,
    Address
} from '../utility-components';

const labels = {
    '/sequenceNumber': 'ID Nr.',
    
    '/state/name': 'Bezeichnung',
    '/state/shorthand': 'Kürzel',
    '/state/address': 'Adresse',
    '/state/description': 'Beschreibung',
}

const [ Personnel, PersonnelContext ] = createBase();
addComponents(Personnel, PersonnelContext, labels, [
    {
        cname: 'SequenceNumber',
        path: '/sequenceNumber',
        Component: withPair(SaneString)
    },
    { cname: 'Name', path: '/state/name' },
    { cname: 'Shorthand', path: '/state/shorthand' },
    
    {
        cname: 'Address',
        path: '/state/address',
        Component: withPair(Address)
    },
    
    {
        cname: 'Description',
        path: '/state/description',
        Component: withPair(FullText)
    },
]);

export default Personnel;
