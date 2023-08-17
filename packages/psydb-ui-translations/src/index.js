import render from 'es6-template-strings';

var maps = [
    {
        en: 'Subjects',
        de: 'Proband:innen'
    },
    {
        en: 'Studies',
        de: 'Studien',
    },
    {
        en: 'Calendars',
        de: 'Kalender'
    },
    {
        en: 'Reception',
        de: 'Rezeption',
    },
    {
        en: 'Inhouse Appointments',
        de: 'Interne Termine'
    },
    {
        en: 'External Appointments',
        de: 'Externe Termine'
    },
    {
        en: 'Video Appointments',
        de: 'Video Termine',
    },
    {
        en: 'Lab Operation',
        de: 'Studienbetrieb'
    },
    {
        en: 'Reservation',
        de: 'Reservierung'
    },
    {
        en: 'Subject Selection',
        de: 'Proband:innenauswahl'
    },
    {
        en: 'Confirm Appointments',
        de: 'Terminbestätigung'
    },
    {
        en: 'Postprocessing',
        de: 'Nachbereitung'
    },
    {
        en: 'Locations',
        de: 'Locations'
    },
    {
        en: 'External Persons',
        de: 'Externe Personen'
    },
    {
        en: 'External Organizations',
        de: 'Externe Organisationen'
    },
    {
        en: 'Study Topics',
        de: 'Themengebiete'
    },
    {
        en: 'Helper Tables',
        de: 'Hilfstabellen'
    },
    {
        en: 'Personnel',
        de: 'Mitarbeiter:innen'
    },
    {
        en: 'Research Groups',
        de: 'Forschungsgruppen'
    },
    {
        en: 'System Roles',
        de: 'System-Rollen'
    },
    {
        en: 'Record Types',
        de: 'Datensatz-Typen'
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
