import React from 'react';
import classnames from 'classnames';
import { LinkContainer } from 'react-router-bootstrap';

export const Level3 = (ps) => {
    var {
        showTitle = true,
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

    var renderedTitle = (
        !showTitle
        ? null
        : (
            titleLinkUrl
            ? (
                <h4 className={ titleClassName }>
                    <LinkContainer to={ titleLinkUrl }>
                        <span role='button'>
                            { title }
                        </span>
                    </LinkContainer>
                </h4>
            )
            : (
                <h4 className={ titleClassName }>
                    { title }
                </h4>
            )
        )
    );

    return (
        <>
            { renderedTitle }
            { children }
        </>
    )
}
