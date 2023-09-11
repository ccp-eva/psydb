import React from 'react';
import { collections as collectionEnum } from '@mpieva/psydb-schema-enums';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

export const CRTFieldRefList = (ps) => {
    var { crtFieldRefs } = ps;
    var translate = useUITranslation();
    return (
        <>
            <b>{ translate('Fields') }</b>
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

