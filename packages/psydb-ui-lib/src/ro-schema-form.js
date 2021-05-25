import React  from 'react';

import { Button } from 'react-bootstrap';

import { withTheme } from '@mpieva/rjsf-monkey-patch';
import RJSFReadonlyTheme from './rjsf-readonly-theme';

var SchemaForm = withTheme(RJSFReadonlyTheme);

const ROSchemaForm = ({
    ...downstream
}) => {
    return (
        <SchemaForm
            noHtml5Validate={ true }
            showErrorList={ false }
            { ...downstream }
        >
            <div>
            </div>
        </SchemaForm>
    );
}

export default ROSchemaForm;
