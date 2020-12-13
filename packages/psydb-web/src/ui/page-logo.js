import * as React from 'react';
import { FontSizes, NeutralColors } from '@fluentui/theme';
import { CommandBar } from '@fluentui/react';

const styles= {
    boxSizing: 'border-box',
    backgroundColor: '#008272',
    fontSize: FontSizes.size42,
    fontWeight: 'bold',
    color: NeutralColors.white,
    paddingLeft: 40,
    paddingTop: 12,
    height: 88,
}

export const PageLogo = () => (
    <div style={ styles }>
        PsyDB
    </div>
);

