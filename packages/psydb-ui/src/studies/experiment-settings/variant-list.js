import React from 'react';
import groupBy from '@mpieva/psydb-common-lib/src/group-by';
import VariantListItem from './variant-list-item';

const VariantList = (ps) => {
    var {
        variantRecords,
        settingRecords,
        ...downstream
    } = ps;

    if (variantRecords.length < 1) {
        return (
            <div className='p-3 text-muted'>
                <i>Keine Ablauf-Einstellungen vorhanden</i>
            </div>
        )
    }

    var groupedSettings = groupBy({
        items: settingRecords,
        byProp: 'experimentVariantId'
    });

    return (
        <div>
            { variantRecords.map((it, index) => {
                return (
                    <VariantListItem key={ index } {...({
                        index,
                        variantRecord: it,
                        settingRecords: groupedSettings[it._id] || [],
                        ...downstream,
                    })} />
                )
            })}
        </div>
    );
}

export default VariantList;
