import React from 'react';
import { only } from '@mpieva/psydb-core-utils';
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
        availableSubjectCRTs,
        subjectTypeMap,

        onRemove,
        onAddAgeFrame,
    } = ps;

    var pass = only({ from: ps, keys: [
        'ageFrameRecords',
        'ageFrameRelated',
        'onEditAgeFrame',
        'onRemoveAgeFrame',
    ]})

    var translate = useUITranslation();

    var {
        studyId,
        subjectTypeKey,
        state: selectorState
    } = selectorRecord;

    var subjectCRT = availableSubjectCRTs.find({ type: subjectTypeKey });

    var permissions = usePermissions();
    var canEdit = permissions.isSubjectTypeAvailable(subjectTypeKey);

    var panelProps = {
        label: translate.crt(subjectCRT),
        addButtonLabel: '+ ' + translate('Age Range'),
        showAddButton: canEdit && !!onAddAgeFrame,
        showRemoveButton: canEdit && !!onRemove,
        onAdd: () => onAddAgeFrame({ selectorRecord, subjectCRT }),
        onRemove: () => onRemove({ index, selectorRecord })
    };

    return (
        <OuterSettingPanel { ...panelProps }>
            <AgeFrameList { ...({
                subjectTypeKey,
                selectorRecord,
                subjectCRT,
                ...pass
            })} />
        </OuterSettingPanel>
    )
}

export default SelectorListItem;
