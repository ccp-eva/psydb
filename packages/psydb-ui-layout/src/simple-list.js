import React from 'react';
import classnames from 'classnames';
import { Button } from 'react-bootstrap';

export const SimpleList = (ps) => {
    var {
        items,
        children,
        emptyLabel = 'Keine Einträge',
        emptyClassName = 'text-danger',
        showAddButton = true,
        disableAddButton = false,
        addButtonLabel = '+ Neuer Eintrag',
        onAdd,
    } = ps;

    if (items.length < 1) {
        return (
            <div>
                <div className={`p-3 ${emptyClassName}`}>
                    <b>{ emptyLabel }</b>
                </div>
                { showAddButton && (
                    <Footer { ...ps } />
                )}
            </div>
        )
    }

    return (
        <div>
            { items.map((it, index) => (
                children && children(it, index)
            ))}
            { showAddButton && (
                <Footer { ...ps } />
            )}
        </div>
    )
}

const Footer = (ps) => {
    var {
        addButtonLabel,
        disableAddButton,
        onAdd
    } = ps;

    return (
        <div className='mt-3'>
            <Button
                size='sm'
                disabled={ disableAddButton }
                onClick={ onAdd }
            >
                { addButtonLabel }
            </Button>
        </div>
    );
}
