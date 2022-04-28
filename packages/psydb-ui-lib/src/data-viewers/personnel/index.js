import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    SaneString,
    FullText,
    EmailWithPrimaryList,
    PhoneWithTypeList,
    DefaultBool,
    SystemPermissions,
} from '../utility-components';

import ResearchGroupSettings from './research-group-settings';

const labels = {
    '/sequenceNumber': 'ID Nr.',
    
    '/gdpr/state/firstname': 'Vorname',
    '/gdpr/state/lastname': 'Nachname',
    '/gdpr/state/emails': 'E-Mail',
    '/gdpr/state/phones': 'Telefon',
    '/gdpr/state/description': 'Beschreibung',

    '/scientific/state/researchGroupSettings': 'Forschungsgruppen',
    '/scientific/state/systemPermissions': 'Zugriff auf diesen Datensatz für'
}

const [ Personnel, PersonnelContext ] = createBase();
addComponents(Personnel, PersonnelContext, labels, [
    {
        cname: 'SequenceNumber',
        path: '/sequenceNumber',
        Component: withPair(SaneString)
    },
    { cname: 'Firstname', path: '/gdpr/state/firstname' },
    { cname: 'Lastname', path: '/gdpr/state/lastname' },
    
    {
        cname: 'Emails',
        path: '/gdpr/state/emails',
        Component: withPair(EmailWithPrimaryList)
    },
    
    {
        cname: 'Phones',
        path: '/gdpr/state/phones',
        Component: withPair(PhoneWithTypeList)
    },
    
    {
        cname: 'Description',
        path: '/gdpr/state/description',
        Component: withPair(FullText)
    },
    
    {
        cname: 'CanLogIn',
        path: '/scientific/state/canLogIn',
        Component: withPair(DefaultBool)
    },
    {
        cname: 'HasRootAcccess',
        path: '/scientific/state/hasRootAccess',
        Component: withPair(DefaultBool)
    },
    {
        cname: 'ResearchGroupSettings',
        path: '/scientific/state/researchGroupSettings',
        Component: withPair(ResearchGroupSettings)
    },

    
    {
        cname: 'SystemPermissions',
        path: '/scientific/state/systemPermissions',
        Component: withPair(SystemPermissions)
    },
]);

export default Personnel;
