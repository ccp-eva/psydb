import React from 'react';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';
import { useSend } from '@mpieva/psydb-ui-hooks';

const UpdateRecordVisibilityButton = (ps) => {
    var {
        className,
        collection,
        id,
        isHidden,
        onSuccessfulUpdate,
        extraPayload,

        forcedVariant,
        size
    } = ps;

    var translate = useUITranslation();

    var sendHide = useSend(() => ({
        type: `${collection}/hide-record`,
        payload: { id, ...extraPayload }
    }), { onSuccessfulUpdate });

    var sendUnhide = useSend(() => ({
        type: `${collection}/unhide-record`,
        payload: { id, ...extraPayload }
    }), { onSuccessfulUpdate });

    return (
        <Button
            className={ className }
            size={ size }
            variant={ forcedVariant || isHidden ? 'primary' : 'secondary' }
            onClick={ () => (
                (isHidden ? sendUnhide : sendHide).exec()
            )}
        >
            { isHidden ? (
                translate('Unhide')
            ) : (
                translate('Hide')
            )}
        </Button>
    );
}

export default UpdateRecordVisibilityButton;
