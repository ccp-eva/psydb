import React from 'react';

import {
    Table
} from 'react-bootstrap';

import {
    FieldDataHeadCols,
    FieldDataBodyCols,
} from '@mpieva/psydb-ui-lib/src/record-list';

import Pair from '@mpieva/psydb-ui-lib/src/pair';

const DetailContainer = ({
    locationComment,
    subjectRecords,
    subjectMetadata,
}) => {
    return (
        <div className='border bg-light pr-3 pl-3'>
            <Pair wLeft={ 2 } label='Kommentar'>{ locationComment }</Pair>
            <Table size='sm' className='border bg-white'>
                <thead>
                    <tr>
                        <FieldDataHeadCols { ...({
                            displayFieldData: subjectMetadata.displayFieldData
                        })}/>
                        <th>Alter</th>
                        <th>Studien</th>
                        <th>Termine</th>
                        <th>Kommentar</th>
                    </tr>
                </thead>
                <tbody>
                    { subjectRecords.map(record => {
                        return (
                            <tr key={record._id}>
                                <FieldDataBodyCols { ...({
                                    record,
                                    ...subjectMetadata
                                }) }/>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    );
}

export default DetailContainer;
