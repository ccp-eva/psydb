import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useRevision, usePermissions, useSortReducer }
    from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, LinkButton, Table, TableHead, TableEmptyFallback }
    from '@mpieva/psydb-ui-layout';

import { TableHeadCustomCols, TableBodyCustomCols }
    from '@mpieva/psydb-custom-fields-ui';


const ConsentFormList = (ps) => {
    var { studyId } = ps;
    
    var { url } = useRouteMatch();
    var [{ translate }] = useI18N();
    
    var revision = useRevision();
    var sorter = useSortReducer({ sortPath: 'state.internalName' });

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.studyConsentForm.list({
            offset: 0, limit: 1000,
            constraints: { '/studyId': studyId }
        })
    ), []);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, recordsCount, displayFieldData, related } = fetched.data;
    var definitions = displayFieldData; // FIXME

    var headBag = { definitions, sorter, canSort: true };
    if (records.length < 1) {
        return (
            <TableEmptyFallback
                emptyInfoText={ 'No study consent forms found.' }
            >
                <TableHeadCustomCols { ...headBag } />
            </TableEmptyFallback>
        )
    }

    return (
        <div className=''>
            <div className='d-flex justify-content-between mb-3'>
                <LinkButton size='sm' to={ `${url}/new` }>
                    { '+ ' + translate('New Consent Form') }
                </LinkButton>
            </div>

            <Table
                style={{ borderCollapse: 'separate', borderSpacing: 0 }}
                hover={ true }
            >
                <TableHead>
                    <TableHeadCustomCols { ...headBag } />
                </TableHead>
                <tbody>
                    { records.map((record, ix) => (
                        <tr
                            key={ ix }
                            style={{ cursor: 'pointer' }}
                            role='button'
                        >
                            <TableBodyCustomCols
                                record={ record }
                                related={ related }
                                definitions={ definitions }
                                wrapAsLinkTo={ `#${url}/${record._id}`}
                            />
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default ConsentFormList;
