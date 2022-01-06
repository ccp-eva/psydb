import React from 'react';
import { FormHelpers } from '@mpieva/psydb-ui-layout';

import WithField from '../with-field';
import * as CoreFields from '../fields';
import { PlainCheckbox } from './plain-checkbox';
import { GenericMultiCheckbox } from './generic-multi-checkbox';

export const SaneString = CoreFields.SaneString;

export const BiologicalGender = (ps) => (
    <GenericMultiCheckbox
        options={{
            'male': 'Männlich',
            'female': 'Weiblich',
        }}
        { ...ps }
    />
)

export const ExtBool = (ps) => (
    <GenericMultiCheckbox
        options={{
            'yes': 'Ja',
            'no': 'Nein',
            'unknown': 'Unbekannt',
        }}
        { ...ps }
    />
)

export const ForeignIdList = WithField({ Control: (ps) => {
    var { dataXPath } = ps;
    return (
        <div className='border p-3'>
            <CoreFields.ForeignIdList
                { ...ps }
                contentFallbackLabel='Keine Bedingungen'
                contentClassName='m-0 p-0'
                noWrapper={ true }
                dataXPath={ `${dataXPath}.values` }
                label='Werte'
            />
            <hr />
            <PlainCheckbox
                dataXPath={ `${dataXPath}.negate` }
                label='Nicht mit diesen Werten'
            />
        </div>
    )
}});

export const HelperSetItemIdList = WithField({ Control: (ps) => {
    var { dataXPath } = ps;
    return (
        <div className='border p-3'>
            <CoreFields.HelperSetItemIdList
                { ...ps }
                contentFallbackLabel='Keine Bedingungen'
                contentClassName='m-0 p-0'
                noWrapper={ true }
                dataXPath={ `${dataXPath}.values` }
                label='Werte'
            />
            <hr />
            <PlainCheckbox
                dataXPath={ `${dataXPath}.negate` }
                label='Nicht mit diesen Werten'
            />
        </div>
    )
}});
