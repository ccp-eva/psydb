import React from 'react';
import {
    experimentVariants as variantsEnum,
} from '@mpieva/psydb-schema-enums';
import { Button, RemoveIconButton } from '@mpieva/psydb-ui-layout';
import SettingList from './setting-list';

const VariantListItem = (ps) => {
    var {
        index,
        variantRecord,
        onRemove,
        onAddSetting,
        ...downstream
    } = ps;

    var {
        studyId,
        type: variantType,
        state: variantState
    } = variantRecord;

    return (
        <div className='bg-white border mb-2 position-relative'>
            <div className='p-3'>
                <header className='border-bottom pb-1 mb-3'>
                    <b>
                        Ablauf { index + 1 }
                        {' - '}
                        { variantsEnum.mapping[variantType] }
                    </b>
                </header>

                <SettingList { ...({
                    variantRecord,
                    ...downstream
                })} />

                <hr />

                <div className='d-flex justify-content-between pr-3'>
                    <Button
                        size='sm'
                        onClick={ () => onAddSetting({ variantRecord })}
                    >
                        + Einstellungen
                    </Button>
                    <RemoveIconButton onClick={ () => onRemove({
                        index,
                        variantRecord,
                    }) } />
                </div>
            </div>
        </div>
    )
}

export default VariantListItem;
