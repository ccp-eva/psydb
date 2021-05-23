import React  from 'react';

import { Button } from 'react-bootstrap';

import { withTheme } from '@mpieva/rjsf-monkey-patch';
import RJSFCustomTheme from './rjsf-theme';

var SchemaForm = withTheme(RJSFCustomTheme);

const DefaultSchemaForm = ({
    buttonLabel,
    ...downstream
}) => {
    return (
        <SchemaForm
            noHtml5Validate={ true }
            showErrorList={ false }
            { ...downstream }
        >
            <div>
                <Button type="submit" className="btn btn-primary">
                    { buttonLabel || 'Speichern' }
                </Button>
            </div>
        </SchemaForm>
    );
}

export default DefaultSchemaForm;
