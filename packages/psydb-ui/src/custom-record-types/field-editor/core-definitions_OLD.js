import React from 'react';
import { omit, entries } from '@mpieva/psydb-core-utils';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';
import { KeyAndDisplayName } from './utility-fields';

const CoreDefinitions = (ps) => {
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

export default CoreDefinitions;
