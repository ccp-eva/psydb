import React from 'react';
import { groupBy, only } from '@mpieva/psydb-core-utils';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { SimpleList } from '@mpieva/psydb-ui-layout';
import SelectorListItem from './selector-list-item';

const SelectorList = (ps) => {
    var {
        selectorRecords,
        ageFrameRecords,

        disableAddSelector,

        onAddSelector,
        onRemoveSelector,
    } = ps;

    var pass = only({ from: ps, keys: [
        'selectorRelated',
        'ageFrameRelated',

        'availableSubjectCRTs',
        'customRecordTypes',
        'subjectTypeMap',

        'onAddAgeFrame',
        'onEditAgeFrame',
        'onRemoveAgeFrame',
    ]})

    var translate = useUITranslation();

    var groupedAgeFrames = groupBy({
        items: ageFrameRecords,
        byProp: 'subjectSelectorId'
    });

    return (
        <SimpleList { ...({
            items: selectorRecords,
            emptyLabel: (
                translate('No subject types with selection settings.')
            ),
            emptyClassName: 'text-muted',
            addButtonLabel: '+ ' + translate('Subject Type'),
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
                    ...pass,
                })} />
            )}
        </SimpleList>
    )
}

export default SelectorList;
