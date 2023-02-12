import { FrequencyWeight, PartOfSpeech } from '../types/enums.type.ts';
import { PartsOfSpeechTranslations, TranslationsData } from '../types/files.type.ts';

type PickTranslations = (params: {
  pickedWords: Array<string>;
  translations: TranslationsData;
}) => TranslationsData;

export const pickTranslations: PickTranslations = (params) => {
  const { pickedWords, translations } = params;

  const pickedTranslations = pickedWords.reduce((acc, word) => {
    const partsOfSpeechTranslations = translations[word].partsOfSpeech;

    if (!partsOfSpeechTranslations) {
      return {
        ...acc,
        [word]: translations[word],
      }
    }

    const partsOfSpeech = Object.keys(partsOfSpeechTranslations) as Array<PartOfSpeech>;
    const partsOfSpeechSortedTranslations = partsOfSpeech.reduce((acc, partOfSpeech) => ({
      ...acc,
      [partOfSpeech]: partsOfSpeechTranslations[partOfSpeech].sort(
        (a, b) => FrequencyWeight[b.frequency] - FrequencyWeight[a.frequency]
      )
    }), {} as PartsOfSpeechTranslations);

    return {
      ...acc,
      [word]: {
        ...translations[word],
        partsOfSpeech: partsOfSpeechSortedTranslations
      },
    };
  }, {});

  return pickedTranslations;
}
