import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import ToggleButton from './toggle-button';

export const ShowPast = (ps) => {
    var { value, onToggle } = ps;
    var [{ translate }] = useI18N();

    return (
        <ToggleButton
            size='sm'
            value={ value }
            onToggle={ onToggle }
            offBag={{
                label: translate('Show Past'),
                variant: 'primary'
            }}
            onBag={{
                label: translate('Hide Past'),
                variant: 'secondary'
            }}
        />
    );
}
