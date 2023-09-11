import React, { useContext, useState } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { groupBy } from '@mpieva/psydb-core-utils';
import {
    useUITranslation,
    RecordEditorContext
} from '@mpieva/psydb-ui-contexts';
import { urlUp as up, demuxed } from '@mpieva/psydb-ui-utils';
import { useFetch, useModalReducer } from '@mpieva/psydb-ui-hooks';

import {
    LoadingIndicator,
    LinkButton,
    Button,
    Alert,
    WithDefaultModal
} from '@mpieva/psydb-ui-layout';

import { UpdateRecordVisibilityButton } from '@mpieva/psydb-ui-lib';
import { PlainCheckbox } from '@mpieva/psydb-ui-form-controls';

const LocationEditorFooter = (ps) => {
    var { onSuccessfulUpdate } = ps;

    var { path, url } = useRouteMatch();
    var translate = useUITranslation();
    var modal = useModalReducer();

    var context = useContext(RecordEditorContext);
    var {
        id, collection, recordType, fetched, permissions,
    } = context;

    var isRoot = permissions.isRoot();
    var canEdit = permissions.hasCollectionFlag(collection, 'write');
    var canRemove = permissions.hasCollectionFlag(collection, 'remove');

    var { record } = fetched;
    var { isHidden } = record.state.systemPermissions;

    return (
        <>
            { (isRoot || canEdit) && (
                <>
                    <UpdateVisibilityModal
                        { ...modal.passthrough }
                        id={ id }
                        onSuccessfulUpdate={ onSuccessfulUpdate }
                    />
                    <div className='d-flex justify-content-between mt-4 mb-4'>
                        { canEdit && (
                            isHidden
                            ? <UpdateRecordVisibilityButton
                                collection={ collection }
                                id={ id }
                                isHidden={ isHidden }
                                onSuccessfulUpdate={ onSuccessfulUpdate }
                            />
                            : (
                                <Button variant='secondary' onClick={ modal.handleShow }>
                                    { translate('Hide') }
                                </Button>
                            )
                        )}
                        
                        { canRemove && (
                            <LinkButton
                                variant='danger'
                                to={`${up(url, 1)}/remove` }
                            >
                                { translate('Delete') }
                            </LinkButton>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

const UpdateVisibilityModalBody = (ps) => {
    var { onHide, id, onSuccessfulUpdate } = ps;

    var translate = useUITranslation();
    var [ detachSubjects, setDetachSubjects ] = useState(false);

    var [ didFetchRefs, fetchedReverseRefs ] = useFetch((agent) => (
        agent.fetchRecordReverseRefs({
            collection: 'location',
            id
        })
    ), [ id ]);

    var [ didFetchExperiments, fetchedExperiments ] = useFetch((agent) => (
        agent.fetchLocationExperiments({
            locationId: id,
            includePastExperiments: false,
            out: 'count'
        })
    ), [ id ]);

    if (!didFetchRefs || !didFetchExperiments) {
        return <LoadingIndicator size='lg' />
    }

    var { reverseRefs } = fetchedReverseRefs.data;

    var groupedReverseRefs = groupBy({
        items: reverseRefs,
        byProp: 'collection',
    });

    var refsFromSubject = groupedReverseRefs.subject || [];

    return (
        <div>
            { (refsFromSubject.length > 0 || fetchedExperiments.data.count > 0) && (
                <Alert variant='danger' className='mt-3'>
                    { refsFromSubject.length > 0 && (
                        <b className='d-block'>
                            { translate(
                                'There are still ${count} subjects in this location!',
                                { count: refsFromSubject.length }
                            ) }
                        </b>
                    )}
                    { fetchedExperiments.data.count > 0 && (
                        <b className='d-block'>
                            { translate(
                                'There still exist ${count} appointments in this location!',
                                { count: fetchedExperiments.data.count }
                            ) }
                        </b>
                    )}
                </Alert>
            )} 
            <div className='mt-3'>
                <PlainCheckbox
                    id='detach'
                    value={ detachSubjects }
                    onChange={ setDetachSubjects }
                    label={ translate('Detach subjects from this location (e.g. for kindergardens)') }
                />
            </div>
            <hr />
            <div className='d-flex justify-content-end'>
                <UpdateRecordVisibilityButton
                    collection='location'
                    id={ id }
                    isHidden={ false }
                    forcedVariant='primary'
                    size='sm'
                    extraPayload={{ detachSubjects }}
                    onSuccessfulUpdate={ demuxed([
                        onHide,
                        onSuccessfulUpdate
                    ])}
                />
            </div>
        </div>
    );
}

const UpdateVisibilityModal = WithDefaultModal({
    title: 'Hide Location',
    size: 'lg',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: UpdateVisibilityModalBody,
});

export default LocationEditorFooter;
