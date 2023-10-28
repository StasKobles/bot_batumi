import * as fs from 'fs';
import * as path from 'path';
import { Languages } from '../../models/types/Session';

interface Translations {
  [key: string]: string;
}

// Загружаем переводы из JSON-файлов
const loadTranslations = (lang: string): Translations => {
  const filePath = path.join(__dirname, `../../locales/${lang}.json`);
  if (fs.existsSync(filePath)) {
    const rawData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(rawData);
  } else {
    throw new Error(`Translation file for ${lang} does not exist.`);
  }
};

// Кешируем загруженные переводы
const cache: { [key: string]: Translations } = {};

export const translate = (key: string, lang: Languages): string => {
  // Если переводы для данного языка еще не загружены, загрузим их
  if (!cache[lang]) {
    try {
      cache[lang] = loadTranslations(lang);
    } catch (error) {
      console.error(error);
      return key; // Вернем ключ, если перевод не найден
    }
  }

  // Ищем перевод по ключу
  return cache[lang][key] || key; // Вернем ключ, если перевод не найден
};
