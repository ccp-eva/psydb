import React from 'react';
import { OptionSelectIndicator } from '@mpieva/psydb-ui-layout';
import { withRecordPicker } from './with-record-picker';
import RecordListContainer from '../record-list-container';

const RecordPicker = withRecordPicker({ RecordList: (ps) => {
    var {
        onSelect,
        
        collection,
        recordType,
        constraints,
        extraIds,
        excludedIds,

        searchOptions,
    } = ps;
    return (
        <RecordListContainer
            className='bg-white'
            tableClassName='border-left border-bottom border-right mb-0'
            bsTableProps={{ hover: true }}
            target='optionlist'
            collection={ collection }
            recordType={ recordType }
            extraIds={ extraIds }
            excludedIds={ excludedIds }
            constraints={ constraints }
            searchOptions={ searchOptions }

            onSelectRecord={ onSelect }

            canSort={ true }

            enableNew={ false }
            enableView={ false }
            enableEdit={ false }
            CustomActionListComponent={ OptionSelectIndicator }
        />
    )
}})

export default RecordPicker;
