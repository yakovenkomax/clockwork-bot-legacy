import { PartOfSpeech } from '../types/enums.type.ts';
import {
  ConfigData, TranslationsByFrequency, TranslationsByPartOfSpeech,
  TranslationsData
} from '../types/files.type.ts';
import { removeWordFromAllTranslations } from './utils/removeWordFromAllTranslations.ts';
import { limitTranslationsByFrequency } from './utils/limitTranslationsByFrequency.ts';
import { isEnoughTranslationsToInclude } from './utils/isEnoughTranslationsToInclude.ts';
import { limitTranslationsByPartOfSpeech } from './utils/limitTranslationsByPartOfSpeech.ts';

type PickTranslations = (params: {
  pickedWords: Array<string>;
  translations: TranslationsData;
  translationPickCount: ConfigData['wordsMessage']['translationPickCount'];
}) => TranslationsData;

export const pickTranslations: PickTranslations = (params) => {
  const { pickedWords, translations, translationPickCount } = params;
  const { minPerPartOfSpeech, maxPerFrequency, maxPerPartOfSpeech } = translationPickCount;

  const pickedTranslations = pickedWords.reduce((acc, word) => {
    const partsOfSpeechTranslations = translations[word].partsOfSpeech;

    if (!partsOfSpeechTranslations) {
      return {
        ...acc,
        [word]: translations[word],
      }
    }

    const partsOfSpeech = Object.keys(partsOfSpeechTranslations) as Array<PartOfSpeech>;
    const partsOfSpeechSortedTranslations = partsOfSpeech.reduce((acc, partOfSpeech) => {
      let translationsByFrequency: TranslationsByFrequency | undefined = { ...partsOfSpeechTranslations[partOfSpeech] };

      if (!translationsByFrequency) {
        return acc;
      }

      translationsByFrequency = removeWordFromAllTranslations({
        translationsByFrequency,
        wordToRemove: translations[word].main
      });

      translationsByFrequency = limitTranslationsByFrequency({
        translationsByFrequency,
        maxPerFrequency,
      });

      const isEnoughToInclude = isEnoughTranslationsToInclude({
        translationsByFrequency,
        minPerPartOfSpeech,
      });

      if (!isEnoughToInclude) {
        return acc;
      }

      translationsByFrequency = limitTranslationsByPartOfSpeech({
        translationsByFrequency,
        maxPerPartOfSpeech,
      });

      return {
        ...acc,
        [partOfSpeech]: translationsByFrequency,
      }
    }, {} as TranslationsByPartOfSpeech);

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
