import { MAIN_TRANSLATION_KEY } from '../types/files.type.ts';

type TranslateWord = (params: { word: string, from: string, to: string }) => Promise<any>;

export const translateWord: TranslateWord = async (params) => {
  const { word, from, to } = params;

  try {
    const res = await fetch(`https://t.song.work/api?text=${word}&from=${from}&to=${to}`);
    const data = await res.json();

    const { result, translations } = data;
    const translationsWithoutReversed = Object.keys(translations).reduce((acc, key) => {
      acc[key] = translations[key].map(item => ({
        translation: item.translation,
        frequency: item.frequency,
      }));

      return acc;
    }, {});

    const restructuredData = {
      [word]: {
        [MAIN_TRANSLATION_KEY]: result,
        ...translationsWithoutReversed
      },
    };

    return restructuredData;
  } catch (error) {
    console.error(`An error occurred during translation of the word "${word}": `, error);

    return undefined;
  }
}
