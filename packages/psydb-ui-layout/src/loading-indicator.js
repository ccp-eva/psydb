import React, { useState, useEffect } from 'react';

const colors = {
    white: {
        baseColor: '#ffffff44',
        highlightColor: '#ffffff',
    },
    primary: {
        baseColor: 'var(--loader-base-color)',
        highlightColor: 'var(--loader-highlight-color)',
    },
    // FIXME: aaaa
    default: {
        baseColor: 'var(--loader-base-color)',
        highlightColor: 'var(--loader-highlight-color)',
    },
    danger: {
        highlightColor: '#eb394b',
        baseColor: '#fecdd0'
    },
    warning: {
        highlightColor: '#f0ca00',
        baseColor: '#ffea77'
    }
};

const sizes = {
    lg: {
        size: '75px',
        thickness: '10px',
    },
    sm: {
        size: '25px',
        thickness: '5px',
    },
    tiny: {
        size: '14px',
        thickness: '2px',
    },
}

const LoadingIndicator = (ps) => {
    var {
        asIcon = false,

        size = 'lg',
        variant = 'default',

        baseColor,
        highlightColor,
        size,
        thickness,
        margin = 'auto',
        style,
        children, // FIXME: are we actually using children??
    } = ps;

    if (!asIcon) {
        return (
            <div>Loading...</div>
        )
    }

    var manualBag = {
        baseColor,
        highlightColor,
        thickness,
        margin,
        style,
        ...(!['sm', 'lg', 'tiny'].includes(size) && { size }),
    };

    var merged = {
        ...sizes[size],
        ...colors[variant],
        ...Object.keys(manualBag).reduce((acc, key) => ({
            ...acc, ...(manualBag[key] !== undefined && { [key]: manualBag[key] })
        }), {})
    };

    //console.log({ merged })

    return (
        <div
            className='psydb-loader'
            style={{
                borderColor: merged.baseColor,
                borderLeftColor: merged.highlightColor,
                borderWidth: merged.thickness,
                width: merged.size,
                height: merged.size,
                margin: merged.margin,
                ...merged.style,
            }}
        >
            { children }
        </div>
    )
}
export default LoadingIndicator;
