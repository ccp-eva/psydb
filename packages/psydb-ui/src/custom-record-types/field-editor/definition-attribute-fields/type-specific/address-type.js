import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Fields } from '@mpieva/psydb-ui-lib';

export const Address = (ps) => {
    var { dataXPath, isUnrestricted } = ps;
    var [{ translate }] = useI18N();

    var bag = { dataXPath, isUnrestricted };
    return (
        <>
            <Flag { ...bag }
                label={ translate('Street Is Required') }
                optionKey='isStreetRequired'
            />
            <Flag { ...bag }
                label={ translate('Housenumber Is Required') }
                optionKey='isHousenumberRequired'
            />
            <Flag { ...bag }
                label={ translate('Affix Is Required') }
                optionKey='isAffixRequired'
            />

            <Flag { ...bag }
                label={ translate('Postcode Is Required') }
                optionKey='isPostcodeRequired'
            />
            <Flag { ...bag }
                label={ translate('City Is Required') }
                optionKey='isCityRequired'
            />
            <Flag { ...bag }
                label={ translate('Country Is Required') }
                optionKey='isCountryRequired'
            />
        </>
    )
}

const Flag = (ps) => {
    var { optionKey, dataXPath, isUnrestricted, ...pass } = ps;

    return (
        <Fields.DefaultBool
            disabled={ !isUnrestricted }
            dataXPath={ `${dataXPath}.props.${optionKey}` }
            uiSplit={[ 6,6 ]}
            { ...pass }
        />
    )
}
