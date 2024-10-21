import React from 'react';
import { OptionSelectIndicator } from '@mpieva/psydb-ui-layout';
import { withRecordPicker } from './with-record-picker';
import RecordListContainer from '../record-list-container';
import OptionList from '../option-list';

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
    
    var TheList = (
        [
            'study',
            // NOTE: theese should also work but ill enable them one by one
            //'location', 'externalOrganization', 'externalPerson',
            //'personnel', 'researchGroup'
        ].includes(collection)
        ? OptionList
        : RecordListContainer
    );

    return (
        <TheList
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
