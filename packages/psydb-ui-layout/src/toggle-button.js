import React from 'react';
import { Button } from 'react-bootstrap';

const ToggleButton = (ps) => {
    var { value, onToggle, onBag, offBag, label, ...sharedBag } = ps;
    if (value) {
        label = onBag.label || label;
        return (
            <Button { ...sharedBag } { ...onBag } onClick={ onToggle }>
                { label }
            </Button>
        );
    }
    else {
        label = offBag.label || label;
        return (
            <Button { ...sharedBag } { ...offBag } onClick={ onToggle }>
                { label }
            </Button>
        );
    }
}

export default ToggleButton;
