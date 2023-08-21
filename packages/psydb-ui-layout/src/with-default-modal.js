import React from 'react';
import { Modal } from 'react-bootstrap';
import { useUITranslation } from '@mpieva/psydb-ui-contexts';

const WithDefaultModal = (options) => (ps) => {
    var {
        Component,
        Body,
        size,
        className = 'team-modal',
        backdropClassName = 'team-modal-backdrop',

        bodyClassName = 'bg-light',

        title: optionsTitle,
        forceShow,
    } = options;

    var {
        show,
        onHide,
        modalPayloadData,
        modalSize: propsModalSize,
        propsTitle,
    } = ps;

    var translate = useUITranslation();
    if (optionsTitle) {
        optionsTitle = translate(optionsTitle);
    }

    var { title: modalPayloadTitle } = modalPayloadData || {};
    var title = modalPayloadTitle || propsTitle || optionsTitle;

    if (forceShow) {
        show = true;
    }

    if (!show) {
        return <Modal show={ show } onHide={ onHide } />
    }

    var renderedContent = (
        Body
        ? (
            <Modal.Body className={ bodyClassName }>
                <Body { ...ps } />
            </Modal.Body>
        )
        : <Component { ...ps } />
    );

    return (
        <Modal { ...({
            show,
            onHide,
            size: propsModalSize || size,
            className,
            backdropClassName
        }) }>
            <Modal.Header>
                <Modal.Title>{ title }</Modal.Title>
            </Modal.Header>
            { renderedContent }
        </Modal>
    )
}

export default WithDefaultModal
