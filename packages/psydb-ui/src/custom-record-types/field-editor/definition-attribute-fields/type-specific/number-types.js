import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields } from '@mpieva/psydb-ui-lib';
import * as Options from '../common-options';

export const Integer = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();

    return (
        <>
            <Fields.Integer
                label={ translate('Minimum') }
                dataXPath={ `${dataXPath}.props.minimum` }
                disabled={ !isUnrestricted }
                required
            />
            <Options.IsNullableProp { ...ps } />
        </>
    )
}

