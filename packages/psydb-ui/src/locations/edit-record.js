import React, { useState, useEffect } from 'react';
import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import agent from '@mpieva/psydb-ui-request-agents';

var SchemaForm = withTheme(Bootstrap4Theme);

const EditRecord = ({
    collection,
    recordType,
    id,
    onSuccessfulUpdate,
}) => {
    var { id } = useParams();

    var [ isInitialized, setIsInitialized ] = useState(false);
    var [ schema, setSchema ] = useState();
    var [ record, setRecord ] = useState();
    
    useEffect(() => {
        var suffix = `${collection}`;
        if (recordType) {
            suffix = `${suffix}/${recordType}`;
        }
        agent.get(`/api/metadata/schema/${suffix}`).then(
            (response) => {
                setSchema(response.data.data);
                agent.get(`/api/read/${collection}/${id}`).then(
                    (response) => {
                        setRecord(response.data.data.record);
                        setIsInitialized(true);
                    }
                )
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
                formData={ record.state }
                onSubmit={ onSubmit }
            >
                <div>
                    <Button type="submit" className="btn btn-primary">
                        Update
                    </Button>
                </div>
            </SchemaForm>
        </div>
    )
}

export default EditRecord;
