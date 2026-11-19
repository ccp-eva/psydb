import React from 'react';
import { useI18N } from '@mpieva/psydb-ui-contexts';
import { Button } from '@mpieva/psydb-ui-layout';

const SubmitAndChangeVisibilityButton = (ps) => {
    var { record, formikForm } = ps;
    
    var [{ translate }] = useI18N();
    
    var isHidden = (
        record?.scientific
        ? record?.scientific.state.systemPermissions.isHidden
        : record?.state.systemPermissions.isHidden
    );

    return (
        <Button
            variant={ isHidden ? 'primary' : 'secondary' }
            onClick={ () => {
                formikForm.setFieldValue('$.setIsHidden', !isHidden);
                return formikForm.submitForm();
            }}
        >
            { isHidden ? (
                translate('Save and Unhide')
            ) : (
                translate('Save and Hide')
            )}
        </Button>
    );
}

export default SubmitAndChangeVisibilityButton;
