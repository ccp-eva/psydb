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
    subjectExperimentMetadata,
    locationMetadata,
    locationExperimentMetadata,

    onToggleDetails,
    selectedLocationId,

    onSelectSubject,
    onSelectManySubjects,
    selectedSubjectIds,

    onCreateExperiment,
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
                            subjectExperimentMetadata,
                            locationMetadata,
                            locationExperimentMetadata,

                            onToggleDetails,
                            selectedLocationId,

                            onSelectSubject,
                            onSelectManySubjects,
                            selectedSubjectIds,
                            
                            onCreateExperiment,
                        }) } />
                    );
                })}
            </tbody>
        </Table>
    );
}

export default TargetLocationTable;
