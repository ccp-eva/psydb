import React from 'react';
import { Modal } from 'react-bootstrap';

const WithDefaultModal = (options) => (ps) => {
    var {
        Component,
        Body,
        size,
        className,
        backdropClassName,

        title,
    } = options;

    var {
        show,
        onHide,
        modalPayloadData
    } = ps;


    if (!show) {
        return <Modal show={ show } onHide={ onHide } />
    }

    var renderedContent = (
        Body
        ? (
            <Modal.Body className='bg-light'>
                <Body { ...ps } />
            </Modal.Body>
        )
        : <Component { ...ps } />
    );

    return (
        <Modal { ...({
            show,
            onHide,
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
