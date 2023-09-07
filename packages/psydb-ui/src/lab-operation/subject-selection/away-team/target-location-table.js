import React from 'react';

import { Table, TableHeadCustomCols } from '@mpieva/psydb-ui-layout';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

import TargetLocationRow from './target-location-row';


const TargetLocationTable = (ps) => {
    var {
        studyIds,
        mergedRecords,
        subjectMetadata,
        subjectExperimentMetadata,
        locationMetadata,
        locationExperimentMetadata,

        onToggleDetails,
        selectedLocationId,

        onEditLocationComment,
        onSelectSubject,
        onSelectManySubjects,
        selectedSubjectIds,

        onCreateExperiment,
    } = ps;

    var translate = useUITranslation();

    return (
        <Table>
            <thead>
                <tr>
                    <TableHeadCustomCols { ...({
                        definitions: locationMetadata.displayFieldData
                    })}/>
                    <th>{ translate('_count_short') }</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { mergedRecords.map(record => {
                    return (
                        <TargetLocationRow { ...({
                            key: record._id,
                            studyIds,
                            record,
                            subjectMetadata,
                            subjectExperimentMetadata,
                            locationMetadata,
                            locationExperimentMetadata,

                            onToggleDetails,
                            selectedLocationId,

                            onEditLocationComment,
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
