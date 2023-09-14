import React from 'react';
import { omit, entries } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Fields, useFormikContext } from '@mpieva/psydb-ui-lib';
import { KeyAndDisplayName } from './utility-fields';

const CoreDefinitions = (ps) => {
    var {
        dataXPath,
        isUnrestricted,
        omittedFieldTypes = []
    } = ps;

    var translate = useUITranslation();
    var { setFieldValue } = useFormikContext();

    return (
        <>
            <Fields.GenericEnum
                label={ translate('Field Type') }
                dataXPath={ `${dataXPath}.type` }
                options={(
                    fieldtypes
                    .filter(type => (
                        !omittedFieldTypes.includes(type)
                    ))
                    .reduce((acc, key) => {
                        var t = translate(`_fieldtype_${key}`);
                        return { ...acc, [key]: `${key} - ${t}` }
                    }, {})
                )}
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

const fieldtypes = [
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

export default CoreDefinitions;
