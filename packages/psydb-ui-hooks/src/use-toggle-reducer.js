import { useState } from 'react';

const useToggleReducer = (initialValue = false, options = {}) => {
    var { as = 'tuple' } = options;
    var [ isOn, setIsOn ] = useState(initialValue);
    var toggle = () => {
        setIsOn(!isOn);
    }

    switch (as) {
        case 'tuple':
            return [ isOn, toggle ];
        case 'props':
            return { value: isOn, onToggle: toggle };
    }
}

export default useToggleReducer;
