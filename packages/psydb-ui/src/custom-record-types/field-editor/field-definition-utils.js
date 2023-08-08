import React from 'react';
import { Fields } from '@mpieva/psydb-ui-lib';

export const IsSpecialAgeFrameField = (ps) => {
    return (
        <Fields.DefaultBool
            dataXPath='$.props.isSpecialAgeFrameField'
            label='Altersfenster-Feld'
        />
    )
}

export const MinLength = (ps) => {
    return (
        <Fields.Integer
            dataXPath='$.props.minLength'
            label='Zeichen (mindestens)'
            min={ 0 }
            required
        />
    )
}

export const MinItems = (ps) => {
    return (
        <Fields.Integer
            dataXPath='$.props.minItems'
            label='Mindestanzahl'
            min={ 0 }
            required
        />
    )
}

export const IsNullable = (ps) => {
    return (
        <Fields.DefaultBool
            dataXPath='$.props.isNullable'
            label='Optional'
        />
    )
}

export const DisplayEmptyAsUnknown = (ps) => {
    return (
        <Fields.DefaultBool
            dataXPath='$.props.displayEmptyAsUnknown'
            label='Leer als "Unbekannt"'
        />
    )
}

