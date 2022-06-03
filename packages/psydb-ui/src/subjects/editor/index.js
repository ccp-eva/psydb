import React, { useContext } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { urlUp as up } from '@mpieva/psydb-ui-utils';

import {
    usePermissions,
    useModalReducer,
    useRevision
} from '@mpieva/psydb-ui-hooks';

import { LinkButton, Button } from '@mpieva/psydb-ui-layout';
import { UpdateRecordVisibilityButton } from '@mpieva/psydb-ui-lib';
import { RecordEditor } from '@mpieva/psydb-ui-record-views/subjects';

const SubjectEditorContainer = ({
    type,
    collection,
    recordType,
    onSuccessfulUpdate,
}) => {
    var { path, url } = useRouteMatch();
    var { id } = useParams();
    var revision = useRevision();

    var editorBag = {
        id, collection, recordType,
        revision, onSuccessfulUpdate
    };
    return (
        <>
            <h3 className='border-bottom'>Proband:in bearbeiten</h3>
            <RecordEditor { ...editorBag }>
                {() => (
                    <Footer onSuccessfulUpdate={ () => {
                        revision.up();
                    }} />
                )}
            </RecordEditor>
        </>
    )
}

const Footer = (ps) => {
    var { onSuccessfulUpdate } = ps;

    var { path, url } = useRouteMatch();
    var context = useContext(RecordEditor.Context);
    var {
        id, collection, recordType, fetched, permissions,
    } = context;

    var isRoot = permissions.isRoot();
    var canEdit = permissions.hasCollectionFlag(collection, 'write');

    var { record } = fetched;

    var isHidden = record.scientific.state.systemPermissions.isHidden;

    return (
        <>
            { (isRoot || canEdit) && (
                <>
                    <div className='d-flex justify-content-between mt-4 mb-4'>
                        { canEdit && (
                            <UpdateRecordVisibilityButton
                                collection={ collection }
                                id={ id }
                                isHidden={ isHidden }
                                onSuccessfulUpdate={ onSuccessfulUpdate }
                            />
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

export default SubjectEditorContainer;
