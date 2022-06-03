import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';
import { useSend } from '@mpieva/psydb-ui-hooks';

export const UpdateRecordVisibilityButton = (ps) => {
    var { className, collection, id, isHidden, onSuccessfulUpdate } = ps;

    var sendHide = useSend(() => ({
        type: `${collection}/hide-record`,
        payload: { id },
    }), { onSuccessfulUpdate });

    var sendUnhide = useSend(() => ({
        type: `${collection}/unhide-record`,
        payload: { id }
    }), { onSuccessfulUpdate });

    return (
        <Button
            className={ className }
            variant={ isHidden ? 'primary' : 'secondary' }
            onClick={ () => (
                (isHidden ? sendUnhide : sendHide).exec()
            )}
        >
            { isHidden ? 'Einblenden' : 'Ausblenden' }
        </Button>
    );
}
