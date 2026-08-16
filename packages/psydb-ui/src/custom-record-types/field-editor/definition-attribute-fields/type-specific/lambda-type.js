import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields } from '@mpieva/psydb-ui-lib';

export const Lambda = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();
    
    return (
        <>
            <Fields.GenericEnum
                label={ translate('_lambda_function') }
                dataXPath={ `${dataXPath}.props.fn` }
                options={ translate.options({
                    'deltaYMD': '_lambda_function_deltaYMD'
                })}
                disabled={ !isUnrestricted }
                required
            />
            <Fields.SaneString
                label={ translate('_lambda_input') }
                dataXPath={ `${dataXPath}.props.input` }
                disabled={ !isUnrestricted }
                required
            />
        </>
    )
}

