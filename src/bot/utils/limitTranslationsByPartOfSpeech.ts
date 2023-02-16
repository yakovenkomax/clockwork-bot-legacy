import { ConfigData, TranslationsByFrequency } from '../../types/files.type.ts';
import { Frequency, FrequencyWeight } from '../../types/enums.type.ts';

type LimitTranslationsByPartOfSpeechParams = {
  translationsByFrequency: TranslationsByFrequency,
  maxPerPartOfSpeech: ConfigData['wordsMessage']['translationPickCount']['maxPerPartOfSpeech'],
}

export const limitTranslationsByPartOfSpeech = (params: LimitTranslationsByPartOfSpeechParams) => {
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
