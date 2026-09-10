import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields } from '@mpieva/psydb-ui-lib';
import * as Options from '../common-options';

export const DateTime = (ps) => {
    return (
        <>
            <IsAgeRangeAnchor { ...ps } />
            <Options.IsNullableProp { ...ps } />
        </>
    )
}
export const DateOnlyServerSide = (ps) => {
    return (
        <>
            <IsAgeRangeAnchor { ...ps } />
            <Options.IsNullableProp { ...ps } />
        </>
    )
}

const IsAgeRangeAnchor = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();

    return (
        <Fields.DefaultBool
            label={ translate('Age Range Anchor') }
            dataXPath={ `${dataXPath}.props.isSpecialAgeFrameField` }
            disabled={ !isUnrestricted }
            required
        />
    )
}
