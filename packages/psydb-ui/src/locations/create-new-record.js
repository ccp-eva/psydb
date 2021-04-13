import React, { useState, useEffect } from 'react';
import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'
import { Button } from 'react-bootstrap';

import agent from '@mpieva/psydb-ui-request-agents';

var SchemaForm = withTheme(Bootstrap4Theme);

const CreateNewRecord = ({
    collection,
    recordType,
}) => {
    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ schema, setSchema ] = useState();
    
    useEffect(() => {
        var url = `/api/metadata/schema/${collection}`;
        if (recordType) {
            url = `${url}/${recordType}`;
        }
        agent.get(url).then(
            (response) => {
                setSchema(response.data.data);
                setIsInitialized(true)
            }
        )
    }, [])

    if (!isInitialized) {
        return (
            <div>Loading...</div>
        );
    }

    // TODO
    var onSubmit = () => {};

    return (
        <div>
            <SchemaForm
                schema={ schema.properties.state }
                onSubmit={ onSubmit }
            >
                <div>
                    <button type="submit" className="btn btn-primary">
                        Create
                    </button>
                </div>
            </SchemaForm>
        </div>
    )
}

export default CreateNewRecord;
