import React from 'react';
import { Display } from '../utility-components';

const ExtraDescription = (ps) => {
    var { crtSettings } = ps;
    var { extraDescriptionDisplayFields } = crtSettings;
    var onlyPointers = extraDescriptionDisplayFields.map(it => (
        it.dataPointer
    ));

    return (
        <Display onlyPointers={ onlyPointers } { ...ps } />
    )
}

export default ExtraDescription;
