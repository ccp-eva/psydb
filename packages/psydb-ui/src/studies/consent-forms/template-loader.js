import React, { useState, useCallback } from 'react';

import { useI18N } from '@mpieva/psydb-ui-contexts';
import { useFetch } from '@mpieva/psydb-ui-hooks';

import { Form, LoadingIndicator, AsyncButton } from '@mpieva/psydb-ui-layout';
import * as Controls from '@mpieva/psydb-ui-form-controls';

const TemplateLoader = (ps) => {
    var { subjectType, onLoadTemplate } = ps;
    var [ templateId, setTemplateId ] = useState();
    var [{ translate }] = useI18N();
    
    var [ didFetch, fetched ] = useFetch((agent) => (
        agent.studyConsentTemplate.list({
            filters: {
                '/subjectType': subjectType,
                '/state/isEnabled': true,
            },
            'limit': 1000,
            'offset': 0
        })
    ), [ subjectType ]);

    var { exec: read, isTransmitting } = useFetch((agent) => (
        agent.studyConsentTemplate.read({
            studyConsentTemplateId: templateId
        })
    ), { useEffect: false });

    var load = () => {
        read().then((response) => {
            var { record } = response.data.data;
            onLoadTemplate({
                isEnabled: false,
                elements: record.state.elements,
                title: record.state.title,
                internalName: record.state.templateName
            })
        })
    }

    if (!didFetch) {
        return null
    }

    var { records } = fetched.data;

    var options = {};
    for (var it of records) {
        var { _id, state: { templateName }} = it;
        options[_id] = templateName;
    }

    return (
        <div>
            <Form.Group className='row ml-0 mr-0'>
                <Form.Label className='col-sm-3 col-form-label'>
                    { translate('Available Templates') }
                </Form.Label>
                <div className='col-sm-7 pl-0 pr-0'>
                    <Controls.GenericEnum
                        value={ templateId }
                        onChange={ setTemplateId }
                        options={ options }
                    />
                </div>
                <div className='col-sm-2'>
                    <AsyncButton
                        className='btn-block'
                        onSubmit={ load }
                        isTransmitting={ isTransmitting }
                        disabled={ !templateId }
                    >
                        { translate('Load Template') }
                    </AsyncButton>
                </div>
            </Form.Group>
            {/*<SubmitButton onSubmit={ load.exec } />*/}
        </div>
    )
}

export default TemplateLoader;
