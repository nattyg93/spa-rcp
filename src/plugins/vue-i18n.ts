import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';

Vue.use(VueI18n);

function loadMessages() {
  const context = require.context('@/locales', true, /[a-z0-9-_]+\.json$/i);

  const messages: LocaleMessages = context
    .keys()
    .map(key => {
      const match = key.match(/[a-z0-9-_]+/i);
      const locale = match ? match[0] : '';
      return { key, locale };
    })
    .reduce(
      (msgs, { key, locale }) => ({
        ...msgs,
        [locale]: context(key),
      }),
      {},
    );

  return { context, messages };
}

const { messages } = loadMessages();

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  silentFallbackWarn: true,
  messages,
});

// Hot updates
// if (module.hot) {
//   module.hot.accept(context.id, () => {
//     const {
//       messages: newMessages,
//     }: { messages: LocaleMessages } = loadMessages();

//     Object.keys(newMessages)
//       .filter(locale => messages[locale] !== newMessages[locale])
//       .forEach(locale => {
//         messages[locale] = newMessages[locale];
//         i18n.setLocaleMessage(locale, messages[locale]);
//       });
//   });
// }

export default i18n;
