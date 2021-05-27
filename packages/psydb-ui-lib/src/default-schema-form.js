import React, { useState }from 'react';

import { Button } from 'react-bootstrap';

import { withTheme } from '@mpieva/rjsf-monkey-patch';
import RJSFCustomTheme from './rjsf-theme';

var SchemaForm = withTheme(RJSFCustomTheme);

const DefaultSchemaForm = ({
    buttonLabel,
    ...downstream
}) => {
    var [ hasValidationError, setValidationError ] = useState(undefined);
    var handleValidationError = (errors) => {
        setValidationError(errors);
    }

    return (
        <SchemaForm
            noHtml5Validate={ true }
            showErrorList={ false }
            onError={ handleValidationError }
            { ...downstream }
        >
            <div className='d-flex align-items-center'>
                <Button type="submit" className="btn btn-primary">
                    { buttonLabel || 'Speichern' }
                </Button>
                <div className='pl-3 pr-3'>
                    { hasValidationError && (
                        <b className='text-danger'>
                            Ungültige Eingabedaten!
                        </b>
                    )}
                </div>
            </div>
        </SchemaForm>
    );
}

export default DefaultSchemaForm;
