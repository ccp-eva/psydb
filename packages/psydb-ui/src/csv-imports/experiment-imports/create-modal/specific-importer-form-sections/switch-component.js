import {
    WKPRCEVApeCognition
} from './components';

export const switchComponent = (type) => {
    switch (type) {
        case 'wkprc-evapecognition':
            return WKPRCEVApeCognition;
        default:
            throw new Error(`unknown type ${type}`)
    }
}

