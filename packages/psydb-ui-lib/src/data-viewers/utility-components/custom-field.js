import React from 'react';
import { useThemeContext } from '../core/theme-context';
import * as Fields from './static';

const CustomFieldFallback = (ps) => {
    var { pointer, type } = ps;
    return (
        <div className='text-danger'>{ pointer }: { type } }</div>
    )
}

const fixSystemType = (systemType) => {
    // TODO: make sure that we dont need this mapping anymore
    switch (systemType) {
        case 'EmailList':
            return 'EmailWithPrimaryList';
        case 'PhoneWithTypeList':
            return 'PhoneWithTypeList';
        default:
            return systemType;
    }
};

export const CustomField = (ps) => {
    var { definition, value, related } = ps;
    var { displayName, type, props } = definition;

    type = fixSystemType(type);
    var Component = Fields[type];

    var context = useThemeContext();
    var { Field } = context;

    if (!Component) {
        return (
            <CustomFieldFallback
                type={ type }
                pointer={ definition.pointer }
            />
        );
    }

    return (
        <Field label={ displayName }>
            <Component
                value={ value }
                props={ props }
                related={ related }
            />
        </Field>
    )

    // FIXME: theming
    return (
        <div className='mb-3'>
            <header><b>{ displayName}</b></header>
            <Component
                value={ value }
                props={ props }
                related={ related }
            />
        </div>
    )
}
