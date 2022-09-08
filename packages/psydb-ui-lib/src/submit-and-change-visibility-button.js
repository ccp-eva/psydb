import React from 'react';
import { Button } from '@mpieva/psydb-ui-layout';

const SubmitAndChangeVisibilityButton = (ps) => {
    var { record, formikForm } = ps;
    
    var isHidden = (
        record.scientific
        ? record.scientific.state.systemPermissions.isHidden
        : record.state.systemPermissions.isHidden
    );

    return (
        <Button
            variant={ isHidden ? 'primary' : 'secondary' }
            onClick={ () => {
                formikForm.setFieldValue('$.setIsHidden', !isHidden);
                return formikForm.submitForm();
            }}
        >
            { isHidden ? 'Speichern und Einblenden' : 'Speichern und Ausblenden' }
        </Button>
    );
}

export default SubmitAndChangeVisibilityButton;
