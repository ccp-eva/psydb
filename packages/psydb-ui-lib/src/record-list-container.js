import React, { useState, useEffect } from 'react';
import { Base64 } from 'js-base64';
import { useRouteMatch } from 'react-router-dom';

import {
    usePermissions,
    useURLSearchParams,
    useURLSearchParamsB64,
} from '@mpieva/psydb-ui-hooks';

import { LinkButton } from '@mpieva/psydb-ui-layout';

import CSVSearchExportButton from './csv-search-export-button';
import RecordList from './record-list';

var createExtendedSearchQuery = (currentQuery) => {
    if (!currentQuery) {
        return undefined;
    }

    var specialFilters = {};
    var customFilters = {};
    var customGdprFilters = {};
    var customScientificFilters = {};
    for (var key of Object.keys(currentQuery)) {
        if (!key.startsWith('/')) {
            continue;
        }

        var tokens = key.slice(1).split('/');
        var tail = tokens.pop();
        var prefix = '/' + tokens.join('/');

        switch (prefix) {
            case '/state/custom': 
                customFilters[tail] = currentQuery[key];
                break;
            case '/gdpr/state/custom': 
                customGdprFilters[tail] = currentQuery[key];
                break;
            case '/scientific/state/custom': 
                customScientificFilters[tail] = currentQuery[key];
                break;
            default:
                specialFilters[tail] = currentQuery[key];
        }
    }

    var extQueryData = {
        ...(Object.keys(specialFilters).length && {
            specialFilters
        }),
        ...(Object.keys(customFilters).length && {
            customFilters
        }),
        ...(Object.keys(customGdprFilters).length && {
            customGdprFilters
        }),
        ...(Object.keys(customScientificFilters).length && {
            customScientificFilters
        }),
    }
    console.log(extQueryData);

    if (!Object.keys(extQueryData).length) {
        return undefined;
    }

    return Base64.encode(JSON.stringify(extQueryData));
}

const RecordListContainer = ({
    target,
    collection,
    recordType,
    constraints,
    excludedIds,
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
    
    var [ query, updateQuery ] = (
        (target === 'table' || !target)
        ? useURLSearchParamsB64()
        : useState({})
    );
    console.log(query);
    var { showHidden = false } = query;
    var setShowHidden = (next) => updateQuery({ ...query, showHidden: next });

    var canCreate = permissions.hasCollectionFlag(collection, 'write');
    var canUseExtendedSearch = permissions.hasFlag('canUseExtendedSearch');
    var canUseCSVExport = permissions.hasFlag('canUseCSVExport');

    var extQuery = createExtendedSearchQuery(query);
    var extQueryUrl = (
        extQuery
        ? `${url}/extended-search/?tab=filters&formData=${extQuery}`
        : `${url}/extended-search`
    );
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
                        <LinkButton to={ extQueryUrl }>
                            Erweiterte Suche
                        </LinkButton>
                    )}
                    { enableCSVExport && canUseCSVExport && (
                        <CSVSearchExportButton { ...({
                            className: 'ml-3',

                            collection,
                            recordType,
                            constraints,
                            excludedIds,
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
                excludedIds,
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
