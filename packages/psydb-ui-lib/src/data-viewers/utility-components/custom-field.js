import React from 'react';
import { useUILanguage } from '@mpieva/psydb-ui-contexts';
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
    var { definition, value, record, related } = ps;
    var {
        displayName,
        displayNameI18N = {},
        type,
        props
    } = definition;

    var [ language ] = useUILanguage();

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

    // FIXME: theming
    return (
        <Field label={ displayNameI18N?.[language] || displayName }>
            <Component
                value={ value }
                props={ props }
                definition={ definition }
                record={ record }
                related={ related }
            />
        </Field>
    )
}
