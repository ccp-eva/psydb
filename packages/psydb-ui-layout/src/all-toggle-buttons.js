import React from 'react';
import ToggleButton from './toggle-button';

export const ShowPast = (ps) => {
    var { value, onToggle } = ps;
    return (
        <ToggleButton
            size='sm'
            value={ value }
            onToggle={ onToggle }
            offBag={{
                label: 'zeige Vergangenheit',
                variant: 'primary'
            }}
            onBag={{
                label: 'verstecke Vergangenheit',
                variant: 'secondary'
            }}
        />
    );
}
