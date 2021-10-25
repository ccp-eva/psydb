import React from 'react';
import {
    experimentSelectors as selectorsEnum,
} from '@mpieva/psydb-schema-enums';
import { OuterSettingPanel } from '@mpieva/psydb-ui-layout';
import AgeFrameList from './age-frame-list';

const SelectorListItem = (ps) => {
    var {
        index,
        selectorRecord,
        subjectTypesEnum,

        onRemove,
        onAddAgeFrame,
        ...downstream
    } = ps;

    var {
        studyId,
        subjectTypeKey,
        state: selectorState
    } = selectorRecord;

    var panelProps = {
        label: `${subjectTypesEnum[subjectTypeKey]}`,
        addButtonLabel: '+ Altersfenster',
        onAdd: () => onAddAgeFrame({ selectorRecord }),
        onRemove: () => onRemove({ index, selectorRecord })
    };

    return (
        <OuterSettingPanel { ...panelProps }>
            <AgeFrameList { ...({
                selectorRecord,
                ...downstream
            })} />
        </OuterSettingPanel>
    )
}

export default SelectorListItem;
