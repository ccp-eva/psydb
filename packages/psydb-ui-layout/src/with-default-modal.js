import React from 'react';
import { Modal } from 'react-bootstrap';

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
        propsTitle,
    } = ps;

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
            size,
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
