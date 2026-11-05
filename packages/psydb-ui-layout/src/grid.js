import React from 'react';

export const Grid = (ps) => {
    var { cols = [], rows = [], areas, gap, style: extraStyle, ...pass } = ps;
   
    var style = getStyle({ cols, rows, areas, gap, extraStyle });
    return (
        <div style={ style } { ...pass } />
    )
}

const getStyle = (bag) => {
    var { cols = [], rows = [], areas, gap, extraStyle } = bag;
   
    var style = {
        display: 'grid',
        gridTemplateColumns: Array.isArray(cols) ? cols.join(' ') : cols,
        gridTemplateRows: Array.isArray(rows) ? rows.join(' ') : rows,
        gridTemplateAreas: (
            Array.isArray(areas)
            ? areas.map(it => `"${it}"`).join(' ')
            : areas
        ),
        ...(gap !== undefined && { gap }),
        ...extraStyle
    }
    
    return style;
}

Grid.getStyle = getStyle;
