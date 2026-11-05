import React from 'react';
import { createBase, withPair, addComponents } from '../core';
import {
    SaneString,
    FullText,
    Address,
    ForeignIdList,
    //HelperSetIdList,
    CRTRefList,
} from '../utility-components';

const labels = {
    '/sequenceNumber': 'ID No.',
    
    '/state/name': '_designation',
    '/state/shorthand': 'Shorthand',
    '/state/address': 'Address',
    '/state/description': 'Description',

    '/state/studyTypes': 'Study Types',
    '/state/subjectTypes': 'Subject Types',
    '/state/locationTypes': 'Location Types',
    '/state/externalOrganizationTypes': 'External Organization Types',
    '/state/externalPersonTypes': 'External Person Types',

    '/state/systemRoleIds': 'System Roles',
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
    
    {
        cname: 'StudyTypes',
        path: '/state/studyTypes',
        Component: withPair(CRTRefList.Study)
    },
    {
        cname: 'SubjectTypes',
        path: '/state/subjectTypes',
        Component: withPair(CRTRefList.Subject)
    },
    {
        cname: 'LocationTypes',
        path: '/state/locationTypes',
        Component: withPair(CRTRefList.Location)
    },
    { 
        cname: 'ExternalOrganizationTypes',
        path: '/state/externalOrganizationTypes',
        Component: withPair(CRTRefList.ExternalOrganization)
    },
    { 
        cname: 'ExternalPersonTypes',
        path: '/state/externalPersonTypes',
        Component: withPair(CRTRefList.ExternalPerson)
    },
    
    {
        cname: 'LabMethods',
        path: '/state/labMethods'
    },
    /*{
        cname: 'HelperSetIds',
        path: '/state/helperSetIds',
        Component: withPair(HelperSetIdList)
    },*/
    { 
        cname: 'SystemRoleIds',
        path: '/state/systemRoleIds',
        Component: withPair((ps) => (
            <ForeignIdList { ...ps } props={{ collection: 'systemRole' }} />
        ))
    },
    { cname: 'AdminFallbackRoleId', path: '/state/adminFallbackRoleId' },
]);

export default Personnel;
