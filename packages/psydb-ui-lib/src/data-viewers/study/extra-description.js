import React from 'react';
import { Custom } from '../utility-components';

const ExtraDescription = (ps) => {
    var { crtSettings } = ps;
    var { extraDescriptionDisplayFields } = crtSettings;
    var onlyKeys = extraDescriptionDisplayFields.map(it => (
        // FIXME: we dont store key
        it.dataPointer.replace('/state/custom/', '')
    ));

    return (
        <Custom onlyKeys={ onlyKeys} { ...ps } />
    )
}

export default ExtraDescription;
