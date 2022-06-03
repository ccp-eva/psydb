import React, { useContext } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import { RecordEditorContext } from '@mpieva/psydb-ui-contexts';
import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { LinkButton, Button } from '@mpieva/psydb-ui-layout';
import UpdateRecordVisibilityButton from './update-record-visibility-button';

const GenericRecordEditorFooter = (ps) => {
    var { enableHide, enableRemove, onSuccessfulUpdate } = ps;

    var { path, url } = useRouteMatch();
    var context = useContext(RecordEditorContext);
    var {
        id, collection, recordType, fetched, permissions,
    } = context;

    var isRoot = permissions.isRoot();
    var canEdit = permissions.hasCollectionFlag(collection, 'write');

    var { record } = fetched;

    var isHidden = (
        record.scientific
        ? record.scientific.state.systemPermissions.isHidden
        : record.state.systemPermissions.isHidden
    );

    return (
        <>
            { (isRoot || canEdit) && (enableHide || enableRemove) && (
                <>
                    <div className='d-flex justify-content-between mt-4 mb-4'>
                        { canEdit && enableHide && (
                            <UpdateRecordVisibilityButton
                                collection={ collection }
                                id={ id }
                                isHidden={ isHidden }
                                onSuccessfulUpdate={ onSuccessfulUpdate }
                            />
                        )}
                        
                        { isRoot && enableRemove && (
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

export default GenericRecordEditorFooter;
