import React, { useContext } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { RecordEditorContext } from '@mpieva/psydb-ui-contexts';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { LinkButton, Button } from '@mpieva/psydb-ui-layout';
import UpdateRecordVisibilityButton from './update-record-visibility-button';

const GenericRecordEditorFooter = (ps) => {
    var {
        id,
        collection,
        recordType,
        fetched,
        permissions,

        enableHide,
        enableRemove,
        onSuccessfulUpdate
    } = ps;

    var { path, url } = useRouteMatch();

    var canEdit = permissions.hasCollectionFlag(collection, 'write');
    var canRemove = permissions.hasCollectionFlag(collection, 'remove');

    var { record } = fetched;

    var isHidden = (
        record.scientific
        ? record.scientific.state.systemPermissions.isHidden
        : record.state.systemPermissions.isHidden
    );

    return (
        <>
            { (canRemove || canEdit) && (enableHide || enableRemove) && (
                <>
                    <div className='d-flex justify-content-between mt-4 mb-4'>
                        { (canEdit && enableHide) ? (
                            <UpdateRecordVisibilityButton
                                collection={ collection }
                                id={ id }
                                isHidden={ isHidden }
                                onSuccessfulUpdate={ onSuccessfulUpdate }
                            />
                        ) : <div />}
                        
                        { canRemove && enableRemove && (
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

const ContextWrapper = (ps) => {
    var context = useContext(RecordEditorContext);
    return (
        <GenericRecordEditorFooter { ...context } { ...ps } />
    )
}

// FIXME: not happy with that
ContextWrapper.RAW = GenericRecordEditorFooter;

export default ContextWrapper;
