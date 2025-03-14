import React from 'react';
import classnames from 'classnames';
import { LinkContainer } from 'react-router-bootstrap';

export const Level3 = (ps) => {
    var {
        title,
        titleClassName,
        titleLinkUrl,
        className,
        children
    } = ps;
    
    titleClassName = classnames([
        'border-bottom',
        titleClassName,
    ]);

    return (
        <>
            <h4 className={ titleClassName }>
                <LinkContainer to={ titleLinkUrl }>
                    <span role='button'>
                        { title }
                    </span>
                </LinkContainer>
            </h4>
            { children }
        </>
    )
}
