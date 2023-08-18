import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import ToggleButton from './toggle-button';

export const ShowPast = (ps) => {
    var { value, onToggle } = ps;
    var translate = useUITranslation();

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
