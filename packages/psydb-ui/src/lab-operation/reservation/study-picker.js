import React from 'react';
import { OptionSelectIndicator } from '@mpieva/psydb-ui-layout';
import { StudySelectList, withRecordPicker } from '@mpieva/psydb-ui-lib';

export const StudyPicker = withRecordPicker({ RecordList: (ps) => {
    var {
        onSelect,
        recordType: studyType,
    } = ps;

    var wrappedOnSelect = ({ type, payload }) => {
        var { record } = payload;
        onSelect(record);
    }
    return (
        <StudySelectList
            className='bg-white border m-0 mt-2'
            target='optionlist'

            studyRecordType={ studyType }
            experimentTypes={[
                'inhouse',
                'online-video-call',
                'away-team'
            ]}

            showSelectionIndicator={ false }
            wholeRowIsClickable={ true }
            bsTableProps={{ hover: true }}

            selectedRecordIds={[]}
            onSelectRecord={ wrappedOnSelect }
            CustomActionListComponent={ OptionSelectIndicator }
        />
    )
}})
