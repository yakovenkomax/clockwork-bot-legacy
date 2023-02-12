import { FrequencyWeight, PartOfSpeech } from '../types/enums.type.ts';
import { MAIN_TRANSLATION_KEY, TranslationsData } from '../types/files.type.ts';

type PickTranslations = (params: {
  pickedWords: Array<string>;
  translations: TranslationsData;
}) => TranslationsData;

export const pickTranslations: PickTranslations = (params) => {
  const { pickedWords, translations } = params;

  const pickedTranslations = pickedWords.reduce((acc, word) => {
    const translationEntries = translations[word];
    const partsOfSpeech = Object.keys(translationEntries).filter(key => key !== MAIN_TRANSLATION_KEY) as PartOfSpeech[];
    const partsOfSpeechSortedTranslations = partsOfSpeech.reduce((acc, partOfSpeech) => ({
      ...acc,
      [partOfSpeech]: translationEntries[partOfSpeech].sort(
        (a, b) => FrequencyWeight[b.frequency] - FrequencyWeight[a.frequency]
      )
    }), {});

    return {
      ...acc,
      [word]: {
        [MAIN_TRANSLATION_KEY]: translationEntries[MAIN_TRANSLATION_KEY],
        ...partsOfSpeechSortedTranslations,
      },
    };
  }, {});

  return pickedTranslations;
}
