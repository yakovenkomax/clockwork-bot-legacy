import { Frequency, FrequencyWeight, PartOfSpeech } from '../types/enums.type.ts';
import {
  ConfigData, TranslationsByFrequency, TranslationsByPartOfSpeech,
  TranslationsData
} from '../types/files.type.ts';

type RemoveWordFromAllTranslationsParams = {
  translationsByFrequency: TranslationsByFrequency,
  wordToRemove: string
}

const removeWordFromAllTranslations = (params: RemoveWordFromAllTranslationsParams) => {
  const { translationsByFrequency, wordToRemove } = params;
  const frequencyKeys = Object.keys(translationsByFrequency) as Array<Frequency>;

  return frequencyKeys.reduce((acc, frequency) => {
    const translationsForFrequency = translationsByFrequency[frequency];

    if (!translationsForFrequency) {
      return acc;
    }

    return {
      ...acc,
      [frequency]: translationsForFrequency.filter(translation => translation !== wordToRemove),
    }
  }, {} as TranslationsByFrequency);
}

type LimitTranslationsByFrequencyParams = {
  translationsByFrequency: TranslationsByFrequency,
  minPerPartOfSpeech: ConfigData['wordsMessage']['translationPickCount']['minPerPartOfSpeech'],
  maxPerFrequency: ConfigData['wordsMessage']['translationPickCount']['maxPerFrequency'],
}

const limitTranslationsByFrequency = (params: LimitTranslationsByFrequencyParams) => {
  const { translationsByFrequency, minPerPartOfSpeech, maxPerFrequency } = params;

  let isEnoughToInclude = false;

  const frequencyKeys = Object.keys(translationsByFrequency) as Array<Frequency>;
  const limitedTranslationsByFrequency = frequencyKeys.reduce((acc, frequency) => {
    const translationsForFrequency = translationsByFrequency[frequency];

    if (!translationsForFrequency) {
      return acc;
    }

    const limitedTranslations = translationsForFrequency.slice(0, maxPerFrequency[frequency]);

    acc[frequency] = limitedTranslations;

    isEnoughToInclude = isEnoughToInclude || limitedTranslations.length >= minPerPartOfSpeech[frequency];

    return acc;
  }, [] as TranslationsByFrequency);

  if (!isEnoughToInclude) {
    return undefined;
  }

  return limitedTranslationsByFrequency;
}

type LimitTranslationsByPartOfSpeechParams = {
  translationsByFrequency: TranslationsByFrequency,
  maxPerPartOfSpeech: ConfigData['wordsMessage']['translationPickCount']['maxPerPartOfSpeech'],
}

const limitTranslationsByPartOfSpeech = (params: LimitTranslationsByPartOfSpeechParams) => {
  const { translationsByFrequency, maxPerPartOfSpeech } = params;
  let totalCount = 0;

  const frequencyKeys = Object.keys(translationsByFrequency) as Array<Frequency>;
  const sortedFrequencyKeys = frequencyKeys.sort((a, b) => FrequencyWeight[b] - FrequencyWeight[a]);

  return sortedFrequencyKeys.reduce((acc, frequency) => {
    const translationsForFrequency = translationsByFrequency[frequency];

    if (!translationsForFrequency) {
      return acc;
    }

    const translationsCount = translationsForFrequency.length;

    if (totalCount + translationsCount <= maxPerPartOfSpeech) {
      totalCount += translationsCount;
      acc[frequency] = translationsForFrequency;

      return acc;
    }

    if (totalCount < maxPerPartOfSpeech) {
      const translationsToInclude = translationsForFrequency.slice(0, maxPerPartOfSpeech - totalCount);

      totalCount += translationsToInclude.length;
      acc[frequency] = translationsToInclude;
    }

    return acc;
  }, {} as TranslationsByFrequency);
}

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
        minPerPartOfSpeech,
        maxPerFrequency,
      });

      if (!translationsByFrequency) {
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
