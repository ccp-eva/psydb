import React, { useContext } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';

import {
    useUITranslation,
    RecordEditorContext
} from '@mpieva/psydb-ui-contexts';

import { urlUp as up } from '@mpieva/psydb-ui-utils';
import { LinkButton, Button } from '@mpieva/psydb-ui-layout';
import UpdateRecordVisibilityButton from './update-record-visibility-button';

const GenericRecordEditorFooter = (ps) => {
    var translate = useUITranslation();
    var { path, url } = useRouteMatch();

    var {
        id,
        collection,
        recordType,
        fetched,
        permissions,

        enableHide,
        enableRemove,
        enableCleanGdpr,
        onSuccessfulUpdate,

        removeUrl = `${up(url, 1)}/remove`,
        cleanGdprUrl = `${up(url, 1)}/clean-gdpr`,
        className = 'd-flex justify-content-between mt-4 mb-4'
    } = ps;

    var { record } = fetched;

    var canEdit = permissions.hasCollectionFlag(collection, 'write');
    var canRemove = permissions.hasCollectionFlag(collection, 'remove');

    var isGdprRedacted = record.gdpr?.state === '[[REDACTED]]';
    var canCleanGdpr = canRemove && !isGdprRedacted;
    

    var isHidden = (
        record.scientific
        ? record.scientific.state.systemPermissions?.isHidden
        : record.state.systemPermissions?.isHidden
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
                      
                        <div className='d-flex gapx-3'>
                            { canCleanGdpr && enableCleanGdpr && (
                                <LinkButton
                                    variant='danger'
                                    to={ cleanGdprUrl }
                                >
                                    { translate('Anonymize') }
                                </LinkButton>
                            )}
                            { canRemove && enableRemove && (
                                <LinkButton
                                    variant='danger'
                                    to={ removeUrl }
                                >
                                    { translate('Delete') }
                                </LinkButton>
                            )}
                        </div>
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
