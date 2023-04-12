import React from 'react';
import { collections as collectionEnum } from '@mpieva/psydb-schema-enums';

export const CRTFieldRefList = (ps) => {
    var { crtFieldRefs } = ps;
    return (
        <>
            <b>Felder</b>
            <div className='pl-3'>
                { crtFieldRefs.map(it => (
                    <div>
                        { collectionEnum.mapping[it.collection] }
                        {' -> '}
                        { it.recordTypeLabel }
                        {' -> '}
                        { it.fields.map(it => it.displayName).join(', ')}
                    </div>
                ))}
            </div>
        </>
    )
}

