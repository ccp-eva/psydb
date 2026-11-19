import React from 'react';
import enums from '@mpieva/psydb-schema-enums';
import { useI18N } from '@mpieva/psydb-ui-contexts';

export const CRTFieldRefList = (ps) => {
    var { crtFieldRefs } = ps;
    var [{ translate }] = useI18N();
    return (
        <>
            <b>{ translate('Fields') }</b>
            <div className='pl-3'>
                { crtFieldRefs.map(it => (
                    <div>
                        { enums.collections.mapping[it.collection] }
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

