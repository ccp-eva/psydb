import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
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

    var permissions = usePermissions();
    var canEdit = permissions.isSubjectTypeAvailable(subjectTypeKey);

    var panelProps = {
        label: `${subjectTypeRecord.state.label}`,
        addButtonLabel: '+ ' + translate('Age Range'),
        showAddButton: canEdit && !!onAddAgeFrame,
        showRemoveButton: canEdit && !!onRemove,
        onAdd: () => onAddAgeFrame({ selectorRecord }),
        onRemove: () => onRemove({ index, selectorRecord })
    };

    return (
        <OuterSettingPanel { ...panelProps }>
            <AgeFrameList { ...({
                subjectTypeKey,
                selectorRecord,
                subjectTypeRecord,
                ...downstream
            })} />
        </OuterSettingPanel>
    )
}

export default SelectorListItem;
