import React from 'react';
import { InnerSettingPanel, EditIconButton } from '@mpieva/psydb-ui-layout';
import stringifyFieldValue from '@mpieva/psydb-ui-lib/src/stringify-field-value';
import { AgeFrameCondition } from './age-frame-condition';


export const AgeFrame = ({
    index,
    ageFrame,
    conditions,

    subjectRecordType,
    subjectTypeData,

    onEditAgeFrame,
    onRemoveAgeFrame,
    ...downstream
}) => {
    
    var stringifiedAgeFrame = stringifyFieldValue({
        rawValue: ageFrame,
        fieldDefinition: { type: 'AgeFrame' }
    });

    var panelProps = {
        label: `Altersfenster ${ index + 1 } - ${stringifiedAgeFrame}`,
        onEdit: () => onEditAgeFrame({
            type: 'edit',
            ageFrame,
            conditions,
            subjectRecordType,
            subjectTypeData,
        }),
        onRemove: () => onRemoveAgeFrame({})
    };

    return (
        <InnerSettingPanel { ...panelProps }>
            { conditions.map((it, index) => (
                <AgeFrameCondition key={ index } { ...({
                    index,
                    ...it,
            
                    subjectTypeData,
                    ...downstream
                }) } />
            ))}
        </InnerSettingPanel>
    )
}
