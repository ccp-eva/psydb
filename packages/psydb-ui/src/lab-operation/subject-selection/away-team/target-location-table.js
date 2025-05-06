import React from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Table } from '@mpieva/psydb-ui-layout';
import { TableHeadCustomCols } from '@mpieva/psydb-custom-fields-ui';

import TargetLocationRow from './target-location-row';


const TargetLocationTable = (ps) => {
    var { mergedRecords, locationMetadata, ...pass } = ps;
    
    var [{ translate }] = useI18N();
    var { definitions } = locationMetadata;

    return (
        <Table>
            <thead>
                <tr>
                    <TableHeadCustomCols definitions={ definitions } />
                    <th>{ translate('_count_short') }</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                { mergedRecords.map(record => {
                    return (
                        <TargetLocationRow { ...({
                            key: record._id,
                            record,
                            locationMetadata,
                            ...pass,
                        }) } />
                    );
                })}
            </tbody>
        </Table>
    );
}

export default TargetLocationTable;
