import { translationsEN } from "./en";
import { translationsFI } from "./fi";

export enum Locales {
  En = "en",
  Fi = "fi",
}

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

export const formatMessage = (
  locale: Locales,
  value: keyof typeof translationsEN,
  values?: Values,
) => {
  const message = translations[locale][value];

  if (!values) {
    return message;
  }

  return formMessage(message, values);
};

export const formatMessageSetLocale = (locale: Locales) => (
  value: keyof typeof translationsEN,
  values?: Values,
) => formatMessage(locale, value, values);

export type FormatMessageFunction = ReturnType<typeof formatMessageSetLocale>;
