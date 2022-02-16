import React from 'react';

export const withLabProcedureSettingsIterator = (options) => {
    var { SubjectTypeContainer } = options;
    // FIXME: epic name bro
    var WithLabProcedureSettingsIteratorComponent = (ps) => {
        var {
            labProcedureSettingData,
            className,
            ...pass
        } = ps;

        var {
            records: settingRecords,
            ...settingRelated
        } = labProcedureSettingData;

        return (
            <div className={ className }>
                { settingRecords.map((it, index) => {
                    var {
                        subjectTypeKey,
                        subjectsPerExperiment,
                    } = it.state;

                    var subjectTypeLabel = (
                        settingRelated.relatedCustomRecordTypes
                        .subject[subjectTypeKey].state.label
                    );
                    
                    return (
                        <SubjectTypeContainer { ...({
                            key: subjectTypeKey,
                            
                            subjectTypeKey,
                            subjectTypeLabel,
                            subjectsPerExperiment,

                            ...pass
                        })} />
                    );
                })}
            </div>
        )
    }
    return WithLabProcedureSettingsIteratorComponent;
}
