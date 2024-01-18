import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

const ErrorResponseModal = ({
    show,
    onHide,
    modalPayloadData,
    errorResponse
}) => {
    errorResponse = (
        modalPayloadData
        ? modalPayloadData.errorResponse
        : errorResponse
    );

    var translate = useUITranslation();
    
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
        case 404:
            return [ '_404_not_found', NotFoundError ];
        case 400:
            return [ '_400_bad_request', BadRequestError ];
        case 700:
            return [ ExternalDelegateErrorTitle, ExternalDelegationError ];
        default:
            return [ '_XXX_system_error', DefaultServerError ];
    }
} 

const DefaultServerError = ({
    status,
    statusCode,
    apiStatus,
    data
}) => {
    var translate = useUITranslation();
    return (
        <div>
            <h5>{ status } ({ statusCode })</h5>
            <div>
                { data.message }
            </div>
        </div>
    )
}

const NotFoundError = ({
    status,
    statusCode,
    apiStatus,
    data
}) => {
    var translate = useUITranslation();
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
    var translate = useUITranslation();
    return (
        <div className='text-danger'>
            { translate('The data sent contains invalid values.') }
        </div>
    )
}

const ExternalDelegateErrorTitle = (ps) => {
    var translate = useUITranslation();
    return (
        <span className='text-warning'>{ translate('Warning') }</span>
    )
}
const ExternalDelegationError = (ps) => {
    var { apiStatus, data } = ps;
    var translate = useUITranslation();
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
export default ErrorResponseModal;
