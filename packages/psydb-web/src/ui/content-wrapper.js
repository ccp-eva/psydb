import * as React from 'react';
import { mergeStyles } from '@fluentui/react';

var styles = {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 40,
    paddingRight: 40,
}

export const ContentWrapper = ({ children }) => (
    <div style={ styles }>
        { children }
    </div>
);
