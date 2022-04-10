import React from 'react';
import classnames from 'classnames';
import { LinkContainer } from 'react-router-bootstrap';

export const Level1 = (ps) => {
    var {
        showTitle = true,
        title,
        titleClassName,
        titleLinkUrl,
        className,
        children
    } = ps;
    
    titleClassName = classnames([
        'mb-0 border-bottom',
        titleClassName,
    ]);

    var renderedTitle = (
        !showTitle
        ? null
        : (
            titleLinkUrl
            ? (
                <h1 className={ titleClassName }>
                    <LinkContainer to={ titleLinkUrl }>
                        <span role='button'>
                            { title }
                        </span>
                    </LinkContainer>
                </h1>
            )
            : (
                <h1 className={ titleClassName }>
                    { title }
                </h1>
            )
        )
    );

    return (
        <div>
            { renderedTitle }
            { children }
        </div>
    )
}
