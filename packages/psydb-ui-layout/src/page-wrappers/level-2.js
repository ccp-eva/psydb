import React from 'react';
import classnames from 'classnames';
import { LinkContainer } from 'react-router-bootstrap';

export const Level2 = (ps) => {
    var {
        title,
        titleClassName,
        titleLinkUrl,
        className,
        children
    } = ps;
    
    titleClassName = classnames([
        'mt-0 mb-3 text-muted',
        titleClassName,
    ]);

    var renderedTitle = (
        titleLinkUrl
        ? (
            <h5 className={ titleClassName }>
                <LinkContainer to={ titleLinkUrl }>
                    <span role='button'>
                        { title }
                    </span>
                </LinkContainer>
            </h5>
        )
        : (
            <h5 className={ titleClassName }>
                { title }
            </h5>
        )
    );
    return (
        <>
            { renderedTitle }
            { children }
        </>
    )
}
