import React from 'react';
import groupBy from '@mpieva/psydb-common-lib/src/group-by';
import { SimpleList } from '@mpieva/psydb-ui-layout';
import SelectorListItem from './selector-list-item';

const SelectorList = (ps) => {
    var {
        selectorRecords,
        ageFrameRecords,

        disableAddSelector,

        onAddSelector,
        onRemoveSelector,
        ...downstream
    } = ps;

    var groupedAgeFrames = groupBy({
        items: ageFrameRecords,
        byProp: 'subjectSelectorId'
    });

    return (
        <SimpleList { ...({
            items: selectorRecords,
            emptyLabel: 'Keine Probandentypen mit Auswahlbedingungen',
            emptyClassName: 'text-muted',
            addButtonLabel: '+ Probandentyp',
            onAdd: onAddSelector,
            showAddButton: !!onAddSelector,
            disableAddButton: disableAddSelector,
        }) }>
            {(it, index) => (
                <SelectorListItem key={ index } {...({
                    index,
                    selectorRecord: it,
                    ageFrameRecords: groupedAgeFrames[it._id] || [],
                    onRemove: onRemoveSelector,
                    ...downstream,
                })} />
            )}
        </SimpleList>
    )
}

export default SelectorList;
