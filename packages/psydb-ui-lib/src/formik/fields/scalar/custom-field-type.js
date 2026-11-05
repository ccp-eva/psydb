import React from 'react';
import { withField } from '@cdxoo/formik-utils';
import { FieldDefinitionSchemas } from '@mpieva/psydb-common-lib';
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

    var list = [];
    for (var it of availableTypes) {
        list.push({
            key: it,
            label: translate(`_fieldtype_${it}`) + ` [${it}]`
        });
    }

    list.sort((a, b) => (
        a.label < b.label ? -1 : 1
    ))

    var options = {};
    for (var it of list) {
        options[it.key] = it.label;
    }

    return (
        <GenericEnum.Control { ...pass } options={ options } />
    )
}});

const allTypes = [
    ...Object.keys(FieldDefinitionSchemas).filter(it => (
        // FIXME
        !['URLString', 'URLStringList', 'SaneStringList'].includes(it)
    ))
]
