import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { GenericEnum } from './generic-enum';

export const CustomFieldType = withField({ Control: (ps) => {
    var { only: onlyTypes, omit: omitTypes, ...pass } = ps;
    var [{ translate }] = useI18N();

    var availableTypes = [ ...allTypes ];
    if (onlyTypes?.length) {
        availableTypes = [ ...onlyTypes ]
    }
    if (omitTypes?.length) {
        availableTypes = availableTypes.filter(it => (
            !omitTypes.includes(it)
        ));
    }

    var options = {};
    for (var it of availableTypes) {
        options[it] = translate(`_fieldtype_${it}`) + ` [${it}]`;
    }

    return (
        <GenericEnum.Control { ...pass } options={ options } />
    )
}});

const allTypes = [
    'SaneString',
    'FullText',
    
    'Integer',
    'DefaultBool',
    'ExtBool',
    
    'DateTime',
    'DateOnlyServerSide',

    'HelperSetItemId',
    'HelperSetItemIdList',
    'ForeignId',
    'ForeignIdList',
    
    'Address',
    'GeoCoords',
    'BiologicalGender',

    'Email',
    'EmailList',
    'Phone',
    'PhoneList',
    'PhoneWithTypeList',

    'ListOfObjects',
    'Lambda',
].sort((keyA, keyB) => (
    keyA < keyB ? -1 : 1
))

