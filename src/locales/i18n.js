import { createI18n } from "vue-i18n";
import store from "../store";
import messages from "./getLang";

const lang = store.state.user.lang;
const i18n = createI18n({
  legacy: false,
  locale: lang,
  fallbackLocale: "en",
  messages: {
    en: { ...messages.en },
    zh: { ...messages.zh },
  },
});

export function changeLang(locale) {
  i18n.global.locale.value = locale;
  store.dispatch("user/setLang", locale);
}
export default i18n;
