import React from 'react';
import { SimpleList, OuterSettingPanel } from '@mpieva/psydb-ui-layout';

//import GeneralSubjectTypeSettings from './general-subject-type-settings';
import ConditionsByAgeFrame from './conditions-by-age-frame';

const SelectionSettingsBySubjectType = (ps) => {
    var {
        settings,
        subjectTypeData,
        
        onAddSubjectType,
        ...downstream
    } = ps;

    var listProps = {
        items: settings,
        emptyLabel: 'Keine Auswahlbedingungen vorhanden',
        emptyClassName: 'text-muted', // maybe muted
        addButtonLabel: '+ Bedingungen',
        onAdd: () => onAddSubjectType({
            existingSubjectTypeKeys: settings.map(it => (
                it.subjectRecordType
            )),
        }),
    }

    return (
        <SimpleList { ...listProps }>
            {(setting, index) => (
                <SubjectType key={ index } { ...({
                    setting,
                    subjectTypeData: subjectTypeData.find(td => (
                        td.type === setting.subjectRecordType
                    )),

                    ...downstream,
                })} />
            )}
        </SimpleList>
    );
}

const SubjectType = (ps) => {
    var {
        setting,
        subjectTypeData,
        studyData,
        onRemoveSubjectType,
        onAddAgeFrame,
        ...downstream
    } = ps;

    var { subjectRecordType, conditionsByAgeFrame } = setting;

    var { relatedCustomRecordTypeLabels } = studyData;
    var { label } = (
        relatedCustomRecordTypeLabels.subject[subjectRecordType].state
    );

    var panelProps = {
        label,
        addButtonLabel: '+ Altersfenster',
        onAdd: () => onAddAgeFrame({
            type: 'create',
            subjectRecordType,
            subjectTypeData,
        }),
        onRemove: () => onRemoveSubjectType({})
    };

    return (
        <OuterSettingPanel { ...panelProps }>
            <ConditionsByAgeFrame { ...({
                conditionsByAgeFrame,

                subjectRecordType,
                subjectTypeData,
                studyData,
                
                ...downstream
            }) } />
        </OuterSettingPanel>
    )
}

export default SelectionSettingsBySubjectType;
