import React from 'react';
import { bwTextColorForBackground } from '@mpieva/psydb-ui-utils';

export const ColorBox = (ps) => {
    var { background, ...pass } = ps;
    return (
        <div style={{
            background,
            color: bwTextColorForBackground(background),
        }} { ...pass } />
    )
}
