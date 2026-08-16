import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';

import KeyAndDisplayName from './key-and-display-name';

const CoreDefinitionAttributes = (ps) => {
    var {
        dataXPath,
        isUnrestricted,
        omittedFieldTypes = []
    } = ps;

    var [{ translate }] = useI18N();
    var { setFieldValue } = useFormikContext();

    return (
        <>
            <Fields.CustomFieldType
                label={ translate('Field Type') }
                dataXPath={ `${dataXPath}.type` }
                omit={ omittedFieldTypes }
                extraOnChange={ (next) => {
                    var defaults = {
                        'ListOfObjects': { fields: [] },
                        'ForeignId': { constraints: {} },
                        'ForeignIdList': { constraints: {} },
                    }
                    setFieldValue(
                        `${dataXPath}.props`,
                        defaults[next] || {}
                    );
                }}
                disabled={ !isUnrestricted }
                required
            />
            <hr />
            <KeyAndDisplayName
                dataXPath={ dataXPath }
                isUnrestricted={ isUnrestricted }
            />
            <hr />
        </>
    )
}

export default CoreDefinitionAttributes;
