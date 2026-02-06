import * as Components from './components';

export const switchComponent = (type) => {
    switch (type) {
        case 'wkprc-evapecognition':
            return Components.WKPRCEVApeCognition;
        case 'manual-only-participation':
            return Components.ManualOnlyParticipation;
        case 'online-survey':
            return Components.OnlineSurvey;
        default:
            throw new Error(`unknown type ${type}`)
    }
}

