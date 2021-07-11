import React from 'react';

import {
    Table
} from 'react-bootstrap';

import {
    FieldDataHeadCols,
} from '@mpieva/psydb-ui-lib/src/record-list';

import TargetLocationRow from './target-location-row';

const TargetLocationTable = ({
    mergedRecords,
    subjectMetadata,
    locationMetadata,
    experimentMetadata
}) => {
    return (
        <Table>
            <thead>
                <tr>
                    <FieldDataHeadCols { ...({
                        displayFieldData: locationMetadata.displayFieldData
                    })}/>
                    <th>Anz.</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { mergedRecords.map(record => {
                    return (
                        <TargetLocationRow { ...({
                            key: record._id,
                            record,
                            subjectMetadata,
                            locationMetadata,
                            experimentMetadata
                        }) } />
                    );
                })}
            </tbody>
        </Table>
    );
}

export default TargetLocationTable;
