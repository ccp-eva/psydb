import React from 'react';
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
    var { definition, value, related, diffKind } = ps;
    var { displayName, type, props } = definition;

    type = fixSystemType(type);
    var Component = Fields[type];

    if (!Component) {
        return (
            <CustomFieldFallback
                type={ type }
                pointer={ definition.pointer }
            />
        );
    }

    return (
        <Field label={ displayName } diffKind={ diffKind }>
            <Component
                value={ value }
                props={ props }
                related={ related }
            />
        </Field>
    )
}

// FIXME: theming
const Field = (ps) => {
    var { label, diffKind, children } = ps;
    var header = {
        'N': (
            <header>
                <b className='text-success'>+++</b>
                {' '}
                <b>{ label }</b>
            </header>
        )
    }[diffKind] || <header><b>{ label }</b></header>;

    return (
        <div className='mb-3'>
            { header }
            <div className='bg-light border pt-1 px-2 d-flex'>
                <div>{ children }</div>
                <div>{' '}</div>
            </div>
        </div>
    )
}
