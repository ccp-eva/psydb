import React from 'react';
import { Fields } from '@mpieva/psydb-custom-fields-common';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { InnerSettingPanel, EditIconButton } from '@mpieva/psydb-ui-layout';
import { AgeFrameCondition } from './age-frame-condition';


export const AgeFrame = (ps) => {
    var {
        index,
        selectorRecord,
        ageFrameRecord,
        ageFrameRelated,

        subjectCRT,
        showButtons = true,

        onEdit,
        onRemove,
    } = ps;

    var [{ translate }] = useI18N();

    var { interval, conditions } = ageFrameRecord.state;
    var stringifiedAgeFrame = Fields.AgeFrameInterval.stringifyValue({
        value: interval
    });

    var actionBag = {
        selectorRecord,
        ageFrameRecord,
        ageFrameRelated,
        subjectCRT,
    }

    var panelProps = {
        label: `${translate('Age Range')} ${stringifiedAgeFrame}`,
        showEditButton: !!showButtons && !!onEdit,
        showRemoveButton: !!showButtons && !!onRemove,
        onEdit: () => onEdit(actionBag),
        onRemove: () => onRemove(actionBag)
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
                        subjectCRT,
                        ageFrameRelated,
                    }) } />
                </div>
            ))}
        </InnerSettingPanel>
    )
}
