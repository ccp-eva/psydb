import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { InnerSettingPanel, EditIconButton } from '@mpieva/psydb-ui-layout';
import { stringifyFieldValue } from '@mpieva/psydb-ui-lib';
import { AgeFrameCondition } from './age-frame-condition';


export const AgeFrame = (ps) => {
    var {
        index,
        selectorRecord,
        ageFrameRecord,
        ageFrameRelated,

        subjectTypeRecord,
        subjectCRT,
        showButtons = true,

        onEdit,
        onRemove,
        ...downstream
    } = ps;

    var translate = useUITranslation();

    var { interval, conditions } = ageFrameRecord.state;

    var stringifiedAgeFrame = stringifyFieldValue({
        rawValue: interval,
        fieldDefinition: { type: 'AgeFrameInterval' }
    });

    var panelProps = {
        label: `${translate('Age Range')}  ${stringifiedAgeFrame}`,
        showEditButton: !!showButtons && !!onEdit,
        showRemoveButton: !!showButtons && !!onRemove,
        onEdit: () => onEdit({
            selectorRecord,
            ageFrameRecord,
            ageFrameRelated,
            subjectTypeRecord,
        }),
        onRemove: () => onRemove({
            selectorRecord,
            ageFrameRecord,
            ageFrameRelated,
            subjectTypeRecord,
        })
    };

    if (conditions.length < 1) {
        return (
            <InnerSettingPanel { ...panelProps }>
                <div className='pl-3'>
                    <i className='text-muted'>
                        { translate('No further Conditions') }
                    </i>
                </div>
            </InnerSettingPanel>
        );
    }

    return (
        <InnerSettingPanel { ...panelProps }>
            { conditions.map((it, index) => (
                <div key={ index } className='pl-3'>
                    <AgeFrameCondition key={ index } { ...({
                        index,
                        condition: it,
                
                        subjectTypeRecord,
                        subjectCRT,
                        ageFrameRecord,
                        ageFrameRelated,
                        ...downstream
                    }) } />
                </div>
            ))}
        </InnerSettingPanel>
    )
}
