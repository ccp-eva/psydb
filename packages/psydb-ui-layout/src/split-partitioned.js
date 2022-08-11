import React from 'react';
import classnames from 'classnames';

// see psydb-split-breakpoint-${};
const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'infinite' ];

export const SplitPartitioned = (ps) => {
    var {
        partitions,
        children,
        extraClassName,
        itemClassName,
        breakFirst,
    } = ps;

    if (breakFirst && !breakpoints.includes(breakFirst)) {
        throw new Error(
            `breakFirst "${breakFirst}" is not supported (${breakpoints})`
        );
    }
    
    if (!Array.isArray(children)) {
        children = [ children ];
    }

    var total = partitions.reduce((acc, it) => acc + it, 0);
    return (
        <div className={`d-flex flex-wrap ${extraClassName}`}>
            { children.map((it, index) => (
                <div
                    key={ index }
                    className={ classnames([
                        itemClassName,
                        'flex-grow-1',
                        index === 0 && breakFirst && (
                            `psydb-split-breakpoint-${breakFirst}`
                        )
                    ])}
                    style={{
                        width: `${(partitions[index] / total) * 100}%`
                    }}
                >
                    { it }
                </div>
            ))}
        </div>
    )
}
