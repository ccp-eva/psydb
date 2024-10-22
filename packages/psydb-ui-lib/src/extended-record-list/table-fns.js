import React from 'react';
import { usePermissions } from '@mpieva/psydb-ui-hooks';
import { Pagination } from '@mpieva/psydb-ui-layout';

import CSVExtendedSearchExportButton
    from '../csv-extended-search-export-button.js';

const TableFNs = (ps) => {
    var { pagination, formData } = ps;

    var permissions = usePermissions();
    var canUseCSVExport = permissions.hasFlag('canUseCSVExport');

    return (
        <div className={
            'sticky-top border-bottom d-flex align-items-center bg-light'
        }>
            <div className='flex-grow'>
                <Pagination { ...pagination } />
            </div>
            <div className='media-print-hidden'>
                { canUseCSVExport && (
                    <CSVExtendedSearchExportButton
                        className='ml-3'
                        size='sm'
                        endpoint='study'
                        searchData={ formData }
                    />
                )}
            </div>
        </div>
    )
}

export default TableFNs;
