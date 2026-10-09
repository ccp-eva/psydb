import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields } from '@mpieva/psydb-ui-lib';

export const MinItemsProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();
    
    return (
        <Fields.Integer
            label={ translate('Minimum Number') }
            dataXPath={ `${dataXPath}.props.minItems` }
            disabled={ !isUnrestricted }
            required
            min={ 0 }
        />
    )
}

export const MinLengthProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();
    
    return (
        <Fields.Integer
            label={ translate('Characters (Minimum)') }
            dataXPath={ `${dataXPath}.props.minLength` }
            disabled={ !isUnrestricted }
            required
            min={ 0 }
        />
    )
}

export const IsNullableProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();
    
    return (
        <Fields.DefaultBool
            label={ translate('Optional') }
            dataXPath={ `${dataXPath}.props.isNullable` }
            disabled={ !isUnrestricted }
            required
        />
    )
}

export const DisplayEmptyAsUnknownProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();
    
    return (
        <Fields.DefaultBool
            label={ translate('Empty as "Unknown"') }
            dataXPath={ `${dataXPath}.props.displayEmptyAsUnknown` }
            disabled={ !isUnrestricted }
            required
        />
    )
}

export const IsSensitiveProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();
    
    return (
        <Fields.DefaultBool
            label={ translate('Is Sensitive') }
            dataXPath={ `${dataXPath}.props.isSensitive` }
            disabled={ !isUnrestricted }
            required
        />
    )
}

export const EnableUnknownValueProp = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();
    
    return (
        <Fields.DefaultBool
            label={ translate('Enable "Unknown" Value') }
            dataXPath={ `${dataXPath}.props.enableUnknownValue` }
            disabled={ !isUnrestricted }
            required
        />
    )
}
