import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useModalReducer, useRevision, usePermissions }
    from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, LinkButton }
    from '@mpieva/psydb-ui-layout';

const ConsentFormList = (ps) => {
    var { studyId } = ps;
    
    var { url } = useRouteMatch();
    var [{ translate }] = useI18N();
    
    var revision = useRevision();
    var [ showHidden, setShowHidden ] = useState();

    return (
        <div className=''>
            <div className='d-flex justify-content-between mb-3'>
                <LinkButton size='sm' to={ `${url}/new` }>
                    { '+ ' + translate('New Consent Form') }
                </LinkButton>
            </div>
        </div>
    )
}

export default ConsentFormList;
