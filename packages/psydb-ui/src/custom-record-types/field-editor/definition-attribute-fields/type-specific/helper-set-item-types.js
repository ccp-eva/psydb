import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields } from '@mpieva/psydb-ui-lib';
import * as Options from '../common-options';

export const HelperSetItemId = (ps) => {
    return (
        <>
            <SetId { ...ps } />
            <Options.IsNullableProp { ...ps } />
            <Options.DisplayEmptyAsUnknownProp { ...ps } />
        </>
    )
}

export const HelperSetItemIdList = (ps) => {
    return (
        <>
            <SetId { ...ps } />
            <Options.MinItemsProp { ...ps } />
        </>
    )
}

const SetId = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();

    return (
        <Fields.HelperSetId
            label={ translate('Helper Table') }
            dataXPath={ `${dataXPath}.props.setId` }
            disabled={ !isUnrestricted }
            required
        />
    )
}
