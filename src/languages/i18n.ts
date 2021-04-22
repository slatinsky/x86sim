// internationalization
// documentation: https://github.com/kaisermann/svelte-i18n/blob/main/docs/Getting%20Started.md
import { init, getLocaleFromNavigator, addMessages } from 'svelte-i18n';

import en from './en.json';
import sk from './sk.json';

addMessages('en', en);
addMessages('sk', sk);

// en and sk are not available yet
init({
    fallbackLocale: 'en',
    initialLocale: getLocaleFromNavigator(),
});
