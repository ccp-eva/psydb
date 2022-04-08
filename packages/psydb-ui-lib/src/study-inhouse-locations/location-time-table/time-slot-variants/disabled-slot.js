import React from 'react';

const DisabledSlot = () => {
    var classNames = [
        'text-center',
        'm-1',
        'team-time-slot',
        'disabled',
        'bg-light'
    ];
    var role = '';

    return (
        <div
            className={ classNames.join(' ') }
            style={{
                height: '26px',
            }}
        />
    )
}

export default DisabledSlot;
