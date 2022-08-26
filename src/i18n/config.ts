import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

export const supportedLocales = ['en', 'jp'];

const backend = { loadPath: '/locales/{{lng}}/{{ns}}.json' };
const instance = i18next.createInstance();
instance
    .use(HttpApi)
    .use(LanguageDetector)
    .init({
        fallbackLng: 'en',
        supportedLngs: supportedLocales,
        preload: ['en'],
        ns: 'translations',
        defaultNS: 'translations',
        fallbackNS: false,
        debug: true,
        detection: {
            order: ['querystring', 'navigator', 'htmlTag'],
            lookupQuerystring: 'lang',
        },
        backend
    }, (err, t) => {
        if (err) return console.error(err)
    });

export { backend, instance };