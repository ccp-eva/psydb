import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';

import {
    usePermissions,
    useURLSearchParams,
    useURLSearchParamsB64,
} from '@mpieva/psydb-ui-hooks';

import { LinkButton } from '@mpieva/psydb-ui-layout';

import CSVSearchExportButton from './csv-search-export-button';
import RecordList from './record-list';

const RecordListContainer = ({
    target,
    collection,
    recordType,
    constraints,
    searchOptions,
    defaultSort,

    enableNew,
    enableView,
    enableEdit_old,
    enableRecordRowLink,

    enableExtendedSearch,
    enableCSVExport,

    enableSelectRecords,
    showSelectionIndicator,
    selectedRecordIds,
    onSelectRecord,

    className,
    tableClassName,
    bsTableProps,
    CustomActionListComponent,
}) => {
    var { path, url } = useRouteMatch();
    var permissions = usePermissions();
    
    //var [ query, updateQuery ] = useURLSearchParams();
    //var { showHidden = false } = query;
    //if (showHidden) {
    //    showHidden = showHidden === 'true' ? true : false;
    //}
    //var setShowHidden = (next) => updateQuery({ ...query, showHidden: next });

    var [ query, updateQuery ] = (
        (target === 'table' || !target)
        ? useURLSearchParamsB64()
        : useState({})
    );
    //console.log(query);
    var { showHidden = false } = query;
    var setShowHidden = (next) => updateQuery({ ...query, showHidden: next });

    var canCreate = permissions.hasCollectionFlag(collection, 'write');
    var canUseExtendedSearch = permissions.hasFlag('canUseExtendedSearch');
    var canUseCSVExport = permissions.hasFlag('canUseCSVExport');

    //var [ showHidden, setShowHidden ] = useState(false);

    return (
        <div className={ className }>
            <div className='media-print-hidden mb-3 d-flex justify-content-between'>
                { enableNew && canCreate && (
                    <LinkButton to={`${url}/new`}>
                        Neuer Eintrag
                    </LinkButton>
                )}
                <div>
                    { enableExtendedSearch && canUseExtendedSearch && (
                        <LinkButton to={`${url}/extended-search`}>
                            Erweiterte Suche
                        </LinkButton>
                    )}
                    { enableCSVExport && canUseCSVExport && (
                        <CSVSearchExportButton { ...({
                            className: 'ml-3',

                            collection,
                            recordType,
                            constraints,
                            searchOptions,
                            sort: defaultSort || undefined,

                            //showHidden,
                        })} />
                    )}
                </div>
            </div>
            <RecordList { ...({
                linkBaseUrl: url,
                target,
                collection,
                recordType,
                constraints,
                searchOptions,
                defaultSort,

                enableView,
                enableEdit_old,
                enableRecordRowLink,

                enableSelectRecords,
                showSelectionIndicator,
                selectedRecordIds,
                onSelectRecord,

                tableClassName,
                bsTableProps,
                CustomActionListComponent,

                showHidden,
                setShowHidden,
            }) } />
        </div>
    );
}

export default RecordListContainer;
