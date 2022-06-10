import React, { useContext, useState } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { RecordEditorContext } from '@mpieva/psydb-ui-contexts';
import { urlUp as up, demuxed } from '@mpieva/psydb-ui-utils';
import { useModalReducer } from '@mpieva/psydb-ui-hooks';

import {
    LinkButton,
    Button,
    WithDefaultModal
} from '@mpieva/psydb-ui-layout';

import { UpdateRecordVisibilityButton } from '@mpieva/psydb-ui-lib';
import { PlainCheckbox } from '@mpieva/psydb-ui-form-controls';

const LocationEditorFooter = (ps) => {
    var { onSuccessfulUpdate } = ps;

    var { path, url } = useRouteMatch();
    var modal = useModalReducer();
    var context = useContext(RecordEditorContext);
    var {
        id, collection, recordType, fetched, permissions,
    } = context;

    var isRoot = permissions.isRoot();
    var canEdit = permissions.hasCollectionFlag(collection, 'write');

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
                                    Ausblenden
                                </Button>
                            )
                        )}
                        
                        { isRoot && (
                            <LinkButton
                                variant='danger'
                                to={`${up(url, 1)}/remove` }
                            >
                                Löschen
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
    var [ detachSubjects, setDetachSubjects ] = useState(false);

    return (
        <div>
            <div className='mt-4'>
                <PlainCheckbox
                    id='detach'
                    value={ detachSubjects }
                    onChange={ setDetachSubjects }
                    label='Proband:innen aus Kindergarten herausnehmen'
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
    title: 'Location ausblenden',
    size: 'md',
    bodyClassName: 'bg-light pt-0 pr-3 pl-3',
    Body: UpdateVisibilityModalBody,
});

export default LocationEditorFooter;
