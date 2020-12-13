//import '@fluentui/dist/css/fabric.css';

import * as React from 'react';
import { NeutralColors, Depths } from '@fluentui/theme';
import { Stack, mergeStyles, initializeIcons } from '@fluentui/react';
import { PageLogo } from './page-logo';
import { SideNav } from './side-nav';
import { TopCommands } from './top-commands';
import { ContentWrapper } from './content-wrapper';

mergeStyles({
    selectors: {
        ':global(body), :global(html), :global(#app)': {
            margin: 0,
            padding: 0,
            height: '100vh'
        },
        ':global(body)': {
            backgroundColor: NeutralColors.gray10,
        },
        /*':global(.ms-Nav)': {
            backgroundColor: NeutralColors.white,
            boxShadow: Depths.depth8,
        },*/
        /*':global(.ms-Nav-compositeLink .ms-Nav-linkText)': {
            color: 'red',
        }*/
    }
});

initializeIcons();

export const App = () => (
    <div>
        <Stack horizontal>
            <Stack.Item>
                <PageLogo />
                <SideNav />
            </Stack.Item>
            <Stack.Item grow>
                <TopCommands />
                <ContentWrapper>
                    <div>FOOOOOOOOOOO</div>
                </ContentWrapper>
            </Stack.Item>
        </Stack>
    </div>
)
