import React from 'react';
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
            { isHidden ? 'Einblenden' : 'Ausblenden' }
        </Button>
    );
}

export default UpdateRecordVisibilityButton;
