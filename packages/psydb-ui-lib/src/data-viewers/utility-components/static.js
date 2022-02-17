import React from 'react';

export const SaneString = (ps) => {
    var { value } = ps;
    return (
        <span>{ String(value) }</span>
    );
}
