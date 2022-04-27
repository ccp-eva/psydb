import React from 'react';
import classnames from 'classnames';

import { Button } from 'react-bootstrap';
import LinkButton from './link-button';

const DetailsBox = (ps) => {
    var {
        title,
        children,
        
        canEdit,
        editLabel,
        editUrl,
        
        extraClassName,
        titleExtraClassName,

        onEditClick,
    } = ps;

    var className = classnames([
        'border pl-3 bg-light',
        extraClassName
    ])
    return (
        <div className={ className }>
            <Header
                title={ title }
                canEdit={ canEdit }
                editLabel={ editLabel }
                editUrl={ editUrl } 
                extraClassName={ titleExtraClassName }
            />
            <hr />
            <div className='px-3 pb-3'>
                { children }
            </div>
        </div>

    )
}

const Header = (ps) => {
    var {
        title = 'Datensatz-Details',
        editLabel = 'Bearbeiten',

        canEdit,
        editUrl,
        onEditClick,

        extraClassName
    } = ps;

    var className = classnames([
        'd-flex justify-content-between align-items-start',
        extraClassName
    ]);

    return (
        <h5 className={ className }>
            <span className='d-inline-block pt-3'>{ title }</span>
            { canEdit && editUrl && (
                <LinkButton to={ editUrl }>
                    { editLabel }
                </LinkButton>
            )}
            { canEdit && onEditClick && (
                <Button onClick={ onEditClick }>
                    { editLabel }
                </Button>
            )}
        </h5>
    )
}

export default DetailsBox;
