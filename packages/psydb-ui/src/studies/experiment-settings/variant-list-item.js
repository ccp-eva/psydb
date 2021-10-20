import React from 'react';
import { experimentVariants as evEnum } from '@mpieva/psydb-schema-enums';

const VariantListItem = (ps) => {
    var {
        variantRecord,
        onAddSetting
    } = ps;

    var {
        studyId,
        type: variantType,
        state: variantState
    } = variantRecord;

    return (
        <div className='bg-white border mb-2 position-relative'>
            <div className='p-3'>
                <header>{ evEnum.mapping[variantType] }</header>
            </div>
        </div>
    )
}

export default VariantListItem;
