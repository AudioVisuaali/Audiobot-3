import { translationsEN } from "./en";
import { translationsFI } from "./fi";

export enum Language {
  En = "en",
  Fi = "fi",
}

export const defaultLanguage = Language.En;

const translations: { [key: string]: typeof translationsEN } = {
  en: translationsEN,
  fi: translationsFI,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Values = { [k: string]: any };

const formMessage = (message: string, values: Values) => {
  let modifyMe = message;
  for (const [key, value] of Object.entries(values)) {
    modifyMe = modifyMe.replace(`{{${key}}}`, value);
  }

  return modifyMe;
};

export type TranslationKey = keyof typeof translationsEN;

export const formatMessage = (
  locale: Language,
  value: TranslationKey,
  values?: Values,
) => {
  const message = translations[locale][value];

  if (!values) {
    return message;
  }

  return formMessage(message, values);
};

export const formatMessageSetLocale = (locale: Language) => (
  value: keyof typeof translationsEN,
  values?: Values,
) => formatMessage(locale, value, values);

export type FormatMessageFunction = ReturnType<typeof formatMessageSetLocale>;

export const validateFormatMessageKey = (key: TranslationKey) => key;
