import * as React from 'react';
import { NeutralColors, Depths } from '@fluentui/theme';
import { CommandBar } from '@fluentui/react';

const styles= {
    root: {
        //marginLeft: -1,
        borderBottom: '1px solid',
        borderColor: NeutralColors.gray40,
    }
}

const items = [
    {
        key: 'logout',
        text: 'Abmelden',
        iconProps: { iconName: 'SignOut'}
    }
];

export const TopCommands = () => (
    <CommandBar
        styles={ styles }
        farItems={ items }
    />
);

