import React from 'react';
// XXX: experimental, use with care

export const Grid = (ps) => {
    var { cols = [], gap, style: extraStyle, ...pass } = ps;
   
    var style = {
        display: 'grid',
        gridTemplateColumns: Array.isArray(cols) ? cols.join(' ') : cols,
        ...(gap !== undefined && { gap }),
        ...extraStyle
    }

    return (
        <div style={ style } { ...pass } />
    )
}
