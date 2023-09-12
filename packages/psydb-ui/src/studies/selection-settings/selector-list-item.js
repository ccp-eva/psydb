import React from 'react';
import {
    experimentSelectors as selectorsEnum,
} from '@mpieva/psydb-schema-enums';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { OuterSettingPanel } from '@mpieva/psydb-ui-layout';
import AgeFrameList from './age-frame-list';

const SelectorListItem = (ps) => {
    var {
        index,
        selectorRecord,
        subjectTypeMap,

        onRemove,
        onAddAgeFrame,
        ...downstream
    } = ps;

    var translate = useUITranslation();

    var {
        studyId,
        subjectTypeKey,
        state: selectorState
    } = selectorRecord;

    var subjectTypeRecord = subjectTypeMap[subjectTypeKey];

    var panelProps = {
        label: `${subjectTypeRecord.state.label}`,
        addButtonLabel: '+ ' + translate('Age Range'),
        showAddButton: !!onAddAgeFrame,
        showRemoveButton: !!onRemove,
        onAdd: () => onAddAgeFrame({ selectorRecord }),
        onRemove: () => onRemove({ index, selectorRecord })
    };

    return (
        <OuterSettingPanel { ...panelProps }>
            <AgeFrameList { ...({
                selectorRecord,
                subjectTypeRecord,
                ...downstream
            })} />
        </OuterSettingPanel>
    )
}

export default SelectorListItem;
