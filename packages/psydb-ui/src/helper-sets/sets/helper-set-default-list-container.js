import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import {
    usePermissions,
    useURLSearchParamsB64,
} from '@mpieva/psydb-ui-hooks';

import { LinkButton } from '@mpieva/psydb-ui-layout';
import HelperSetDefaultList from './helper-set-default-list';

const HelperSetDefaultListContainer = (ps) => {
    var {
        canSort,
        defaultSort,

        enableNew,
        enableView,

        className,
        tableClassName,
        bsTableProps,
        
        CustomActionListComponent,
    } = ps;

    var { path, url } = useRouteMatch();
    var translate = useUITranslation();
    var permissions = usePermissions();
    
    var [ query, updateQuery ] = useURLSearchParamsB64();
    
    var { showHidden = false } = query;
    var setShowHidden = (next) => updateQuery({ ...query, showHidden: next });
    
    var canCreate = permissions.hasCollectionFlag('helperSet', 'write');
    
    return (
        <div className={ className }>
            <div className='media-print-hidden mb-3 d-flex justify-content-between'>
                { enableNew && canCreate && (
                    <LinkButton to={`${url}/new`}>
                        { translate('New Record') }
                    </LinkButton>
                )}
            </div>

            <HelperSetDefaultList { ...({
                linkBaseUrl: url,
                canSort,
                defaultSort,

                enableView,
                enableRecordRowLink: false,

                tableClassName,
                bsTableProps,
                CustomActionListComponent,

                showHidden,
                setShowHidden,
            }) } />

        </div>
    )
}

export default HelperSetDefaultListContainer;
