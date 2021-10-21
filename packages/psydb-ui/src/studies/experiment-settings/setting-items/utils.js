import React from 'react';
import {
    EditIconButton,
    RemoveIconButton,
} from '@mpieva/psydb-ui-layout';

export const DefaultSettingWrapper = (ps) => {
    var {
        variantRecord,
        settingRecord,
        settingRelated,
        customRecordTypes,
        showButtons = true,
        onEdit,
        onRemove,

        children,
    } = ps;
    
    var { subjectTypeKey } = settingRecord.state;
    var { relatedCustomRecordTypes } = settingRelated;
    var { label } = relatedCustomRecordTypes.subject[subjectTypeKey].state;

    var actionProps = {
        variantRecord,
        settingRecord,
        settingRelated,
        customRecordTypes
    };

    return (
        <div className='p-3 mb-2 border d-flex justify-content-between align-items-start'>
            <div className='flex-grow-1 mr-4'>
                <header className='mb-2 border-bottom'>
                    <b>{ label }</b>
                </header>
                { children }
            </div>
            { showButtons && (
                <div className='d-flex flex-column'>
                    <EditIconButton className='mb-2' onClick={ () => (
                        onEdit(actionProps)
                    )} />
                    <RemoveIconButton onClick={ () => (
                        onRemove(actionProps)
                    )} />
                </div>
            )}
        </div>
    )
}
