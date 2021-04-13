import React, { useState, useEffect } from 'react';
import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4'
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import allSchemaCreators from '@mpieva/psydb-schema-creators';
import agent from '@mpieva/psydb-ui-request-agents';

var SchemaForm = withTheme(Bootstrap4Theme);

const GenericRecordForm = ({
    type,
    collection,
    recordType,
    onSuccessfulUpdate,
}) => {
    type = type || 'create';
    var id = undefined;
    if (type === 'edit') {
        ({ id } = useParams());
    }

    var { hasSubChannels } = allSchemaCreators[collection];

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
                if (type === 'edit') {
                    agent.get(`/api/read/${collection}/${id}`).then(
                        (response) => {
                            setRecord(response.data.data.record);
                            setIsInitialized(true);
                        }
                    )
                }
                else {
                    setIsInitialized(true);
                }
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
    console.log(schema);

    return (
        <div>
            <SchemaForm
                schema={(
                    hasSubChannels
                    ? {
                        type: 'object',
                        properties: {
                            gdpr: schema.properties.gdpr.properties.state,
                            scientific: schema.properties.scientific.properties.state
                        }
                    }
                    : schema.properties.state
                )}
                formData={ record ? record.state : {}}
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

export default GenericRecordForm;;
