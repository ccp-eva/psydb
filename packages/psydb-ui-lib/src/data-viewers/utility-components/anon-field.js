import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useThemeContext } from '../core/theme-context';

export const AnonField = (ps) => {
    var { definition } = ps;

    var [{ translate }] = useI18N();
    var { Field } = useThemeContext();

    // FIXME: theming
    return (
        <Field label={ translate.fieldDefinition(definition) }>
            <span className='text-danger'>
                { translate('Anonymized') }
            </span>
        </Field>
    )
}
