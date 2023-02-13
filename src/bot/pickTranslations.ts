import { Frequency, FrequencyWeight, PartOfSpeech } from '../types/enums.type.ts';
import {
  ConfigData,
  PartOfSpeechTranslation,
  PartsOfSpeechTranslations,
  TranslationsData
} from '../types/files.type.ts';

type PickTranslations = (params: {
  pickedWords: Array<string>;
  translations: TranslationsData;
  translationPickCount: ConfigData['wordsMessage']['translationPickCount'];
}) => TranslationsData;

export const pickTranslations: PickTranslations = (params) => {
  const { pickedWords, translations, translationPickCount } = params;
  const { maxPerPartOfSpeech, minPerPartOfSpeech, maxPerFrequency } = translationPickCount;

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
      const partOfSpeechTranslations = partsOfSpeechTranslations[partOfSpeech];

      if (!partOfSpeechTranslations) {
        return acc;
      }

      // remove main translation from the list of current part of speech translations
      const partOfSpeechTranslationsWithoutMain = partOfSpeechTranslations.filter(translation => translation.translation !== translations[word].main);

      // limit amount of translations within current part of speech
      const limitedPartOfSpeechTranslations = partOfSpeechTranslationsWithoutMain.reduce((acc, translation) => {
        const { frequency } = translation;
        const limitForFrequency = maxPerFrequency[frequency];
        const countForFrequency = acc.filter(item => item.frequency === frequency).length;

        if (countForFrequency <= limitForFrequency) {
          return [...acc, translation];
        }

        return acc;
      }, [] as Array<PartOfSpeechTranslation>);

      // count part of speech translations by frequency
      const partsOfSpeechTranslationsCountByFrequency = limitedPartOfSpeechTranslations.reduce((acc, translation) => {
        const { frequency } = translation;

        return {
          ...acc,
          [frequency]: (acc[frequency] || 0) + 1,
        }
      }, {} as { [key in Frequency]: number });

      // check if translation count is enough to include current part of speech
      const isPartOfSpeechIncluded = Object.keys(partsOfSpeechTranslationsCountByFrequency).reduce((acc, frequency) => {
        const countForFrequency = partsOfSpeechTranslationsCountByFrequency[frequency as Frequency];
        const minCountForFrequency = minPerPartOfSpeech[frequency as Frequency];

        return acc || countForFrequency >= minCountForFrequency;
      }, false);

      if (!isPartOfSpeechIncluded) {
        return acc;
      }

      // sort translations by frequency
      const sortedPartOfSpeechTranslations = limitedPartOfSpeechTranslations.sort(
        (a, b) => FrequencyWeight[b.frequency] - FrequencyWeight[a.frequency]
      );

      return {
        ...acc,
        [partOfSpeech]: sortedPartOfSpeechTranslations.slice(0, maxPerPartOfSpeech),
      }
    }, {} as PartsOfSpeechTranslations);

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
