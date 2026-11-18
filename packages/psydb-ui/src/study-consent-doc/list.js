import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch, useRevision, usePermissions, useSortReducer }
    from '@mpieva/psydb-ui-hooks';
import { LoadingIndicator, LinkButton, Table, TableHead, TableEmptyFallback }
    from '@mpieva/psydb-ui-layout';

import { TableHeadCustomCols, TableBodyCustomCols }
    from '@mpieva/psydb-custom-fields-ui';


const ConsentDocList = (ps) => {
    var { studyId, subjectId } = ps;
    var canCreate = !!studyId;
    
    var { url } = useRouteMatch();
    var [{ translate }] = useI18N();
    
    var revision = useRevision();
    var sorter = useSortReducer({
        sortPath: 'state.studyConsentFormSnapshot.state.internalName'
    });

    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.studyConsentDoc.list({
            offset: 0, limit: 1000,
            constraints: {
                ...(studyId && { '/studyId': studyId }),
                ...(subjectId && { '/subjectId': subjectId }),
            }
        })
    ), [ studyId, subjectId ]);

    if (!didFetch) {
        return <LoadingIndicator size='lg' />
    }

    var { records, recordsCount, displayFieldData, related } = fetched.data;
    // NOTE: hide the column we are already scoped to
    var definitions = displayFieldData.filter(it => !(
        (studyId && it.pointer === '/studyId')
        || (subjectId && it.pointer === '/subjectId')
    ));

    var headBag = { definitions, sorter, canSort: true };
    if (records.length < 1) {
        return (
            <>
                { canCreate && (
                    <div className='d-flex justify-content-between mb-3'>
                        <LinkButton size='sm' to={ `${url}/new` }>
                            { '+ ' + translate('New Consent Doc') }
                        </LinkButton>
                    </div>
                )}
                <TableEmptyFallback
                    emptyInfoText={ 'No consent docs found.' }
                    tableExtraClassName='bg-white border'
                >
                    <TableHeadCustomCols { ...headBag } />
                </TableEmptyFallback>
            </>
        )
    }

    return (
        <>
            { canCreate && (
                <div className='d-flex justify-content-between mb-3'>
                    <LinkButton size='sm' to={ `${url}/new` }>
                        { '+ ' + translate('New Consent Doc') }
                    </LinkButton>
                </div>
            )}
            <Table
                className='bg-white border'
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
                                related={ related || {} }
                                definitions={ definitions }
                                wrapAsLinkTo={ `#${url}/${record._id}`}
                            />
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}

export default ConsentDocList;
