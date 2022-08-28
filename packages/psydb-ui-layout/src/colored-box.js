import React from 'react';
import { bwTextColorForBackground } from '@mpieva/psydb-ui-utils';

export const ColoredBox = (ps) => {
    var {
        bg,
        as = 'div',
        extraStyle,
        style: __unused,
        ...pass
    } = ps;

    var style = {
        ...extraStyle,
        backgroundColor: bg,
        color: bwTextColorForBackground(bg),
    }

    var Wrapper = as;
    var wrapperBag = { style, ...pass };
    return (
        <Wrapper { ...wrapperBag } />
    )
}
