import React from 'react';
import { Modal, JsonRaw } from '@mpieva/psydb-ui-layout';
import { useI18N } from '@mpieva/psydb-ui-contexts';

const ErrorResponseModal = (ps) => {
    var {
        show, onHide,
        modalPayloadData, errorResponse
    } = ps;
    
    errorResponse = (
        modalPayloadData
        ? modalPayloadData.errorResponse
        : errorResponse
    );

    var [{ translate }] = useI18N();
    
    if (!errorResponse) {
        return null;
    }

    var {
        status: rawStatus,
        data: responseBody,
        config
    } = errorResponse;
    
    var {
        statusCode = rawStatus,
    } = responseBody;

    var [ Title, Body ] = getErrorComponents(statusCode);
    if (typeof Title === 'string') {
        var renderedTitle = (
            <span className='text-danger'>{ translate(Title) }</span>
        );
    }
    else {
        var renderedTitle = (
            <Title />
        )
    }
    return (
        <Modal show={show} onHide={ onHide } size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>
                    { renderedTitle }
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Body { ...responseBody } />
            </Modal.Body>
        </Modal>
    );
}

const getErrorComponents = (statusCode) => {
    switch (statusCode) {
        case 409:
            return [ '_409_conflict', ConflictError ];
        case 404:
            return [ '_404_not_found', NotFoundError ];
        case 400:
            return [ '_400_bad_request', BadRequestError ];
        case 200: // XXX this is BS
            return [ ExternalDelegateErrorTitle, ExternalDelegationError ];
        default:
            return [ '_XXX_system_error', DefaultServerError ];
    }
} 

const DefaultServerError = (ps) => {
    var { status, statusCode, apiStatus, data } = ps;
    var { message, stack, ...rest } = data;

    var [{ translate }] = useI18N();

    return (
        <div>
            <h5>{ status } ({ statusCode })</h5>
            <div>
                { message }
                { Object.keys(rest).length > 0 && (
                    <JsonRaw data={ rest } />
                )}
            </div>
        </div>
    )
}

const ConflictError = (ps) => {
    var { status, statusCode, apiStatus, data } = ps;

    var [{ translate }] = useI18N();
    if (apiStatus === 'DuplicatePersonnelEmail') {
        var { duplicates = [] } = data;
        return (
            <div>
                <div className='text-danger'>
                    { translate('The given email is already in use by an existing account.') }
                </div>
                <div className='ml-4'>
                    { duplicates.map((it, ix) => (
                        <div key={ ix }>
                            <b>{ it.email }</b>
                            {' '}
                            ({ it.firstname } { it.lastname})
                        </div>
                    )) }
                </div>
            </div>
        )
    }
    else {
        return <DefaultServerError { ...ps } />
    }
}

const NotFoundError = ({
    status,
    statusCode,
    apiStatus,
    data
}) => {
    var [{ translate }] = useI18N();
    return (
        <div className='text-danger'>
            { translate('The given url could not be found.') }
        </div>
    )
}

// TODO: make this properly display whats going on
const BadRequestError = ({
    status,
    statusCode,
    apiStatus,
    data
}) => {
    var [{ translate }] = useI18N();
    return (
        <div className='text-danger'>
            { translate('The data sent contains invalid values.') }
        </div>
    )
}

const ExternalDelegateErrorTitle = (ps) => {
    var [{ translate }] = useI18N();
    return (
        <span className='text-warning'>{ translate('Warning') }</span>
    )
}
const ExternalDelegationError = (ps) => {
    var { remoteErrors } = ps;
    var [{ translate }] = useI18N();
    var out = [];
    for (var it of remoteErrors) {
        var { apiStatus, data } = it;
        if (apiStatus === 'SmtpDelegationFailed') {
            return (
                <div>
                    <div>
                        { translate('Could not send email!') }
                        {' '}
                        { translate('Mail-Server response is:') }
                    </div>
                    <div className='mt-3 p-3 bg-light border'>
                        { data.originalMessage }
                    </div>
                </div>
            )
        }
        else {
            return (
                <div>
                    { apiStatus } { data.originalMessage }
                </div>
            )
        }
    }
}
export default ErrorResponseModal;
