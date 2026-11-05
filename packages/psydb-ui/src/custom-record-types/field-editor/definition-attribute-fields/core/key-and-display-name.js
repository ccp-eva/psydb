import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';

const KeyAndDisplayName = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    
    var [{ translate }] = useI18N();
    var { setFieldValue } = useFormikContext();

    return (
        <>
            <Fields.SaneString
                label={ translate('Display Name') }
                dataXPath={ `${dataXPath}.displayName` }
                extraOnChange={ (next) => setFieldValue(
                    `${dataXPath}.key`,
                    next.toLowerCase().replaceAll(/[^A-Za-z0-9]/g, '_')
                )}
                required
            />
            <Fields.SaneString
                label={ translate('Display Name (DE)') }
                dataXPath={ `${dataXPath}.displayNameI18N.de` }
            />
            <Fields.SaneString
                label={ translate('Internal Key') }
                dataXPath={ `${dataXPath}.key` }
                disabled={ !isUnrestricted }
                required
            />
        </>
    )
}

export default KeyAndDisplayName;
