import React, { useContext } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { RecordEditorContext } from '@mpieva/psydb-ui-contexts';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { LinkButton, Button } from '@mpieva/psydb-ui-layout';
import UpdateRecordVisibilityButton from './update-record-visibility-button';

const GenericRecordEditorFooter = (ps) => {
    var { path, url } = useRouteMatch();

    var {
        id,
        collection,
        recordType,
        fetched,
        permissions,

        enableHide,
        enableRemove,
        onSuccessfulUpdate,

        removeUrl = `${up(url, 1)}/remove`,
        className = 'd-flex justify-content-between mt-4 mb-4'
    } = ps;


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
                    <div className={ className }>
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
                                to={ removeUrl }
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
