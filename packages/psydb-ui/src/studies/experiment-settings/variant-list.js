import React from 'react';
import groupBy from '@mpieva/psydb-common-lib/src/group-by';
import VariantListItem from './variant-list-item';

const VariantList = (ps) => {
    var {
        variantRecords,
        settingRecords,

        onAddSetting
    } = ps;

    if (variantRecords.length < 1) {
        return (
            <div className='p-3 text-muted'>
                <i>Keine Ablauf-Einstellungen vorhanden</i>
            </div>
        )
    }

    var settingRecordsByVariantId = groupBy({
        items: settingRecords,
        byProp: 'experimentVariantId'
    });

    return (
        <div>
            { variantRecords.map((it, index) => {
                return (
                    <VariantListItem {...({
                        variantRecord: it,
                        settingRecords: settingRecordsByVariantId[it._id],
                        onAddSetting
                    })} />
                )
            })}
        </div>
    );
}

export default VariantList;
