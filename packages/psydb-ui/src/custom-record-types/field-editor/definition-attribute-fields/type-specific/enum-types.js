import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields } from '@mpieva/psydb-ui-lib';
import * as Options from '../common-options';

export const BiologicalGender = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();

    return (
        <>
            <Options.EnableUnknownValueProp { ...ps } />

            <Fields.DefaultBool
                label={ translate('Enable "Other" Value') }
                dataXPath={ `${dataXPath}.props.enableOtherValue` }
                disabled={ !isUnrestricted }
                required
            />
        </>
    )
}

