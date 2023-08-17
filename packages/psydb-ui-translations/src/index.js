import render from 'es6-template-strings';

var maps = [
    {
        en: 'Subjects',
        de: 'Proband:innen'
    },
]

export const createTranslate = (lang = 'en') => (template, props) => {
    var map = maps.find(it => it.en === template);

    var translatedTemplate = map && map[lang];
    if (translatedTemplate) {
        return render(translatedTemplate, props);
    }
    else {
        return render('[!! ' + template + ' !!]', props);
    }
}
