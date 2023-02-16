import { ConfigData, TranslationsByFrequency } from '../../types/files.type.ts';
import { Frequency } from '../../types/enums.type.ts';

type LimitTranslationsByFrequencyParams = {
  translationsByFrequency: TranslationsByFrequency,
  maxPerFrequency: ConfigData['wordsMessage']['translationPickCount']['maxPerFrequency'],
}

export const limitTranslationsByFrequency = (params: LimitTranslationsByFrequencyParams) => {
  const { translationsByFrequency, maxPerFrequency } = params;

  const frequencyKeys = Object.keys(translationsByFrequency) as Array<Frequency>;
  const limitedTranslationsByFrequency = frequencyKeys.reduce((acc, frequency) => {
    const translationsForFrequency = translationsByFrequency[frequency];

    if (!translationsForFrequency) {
      return acc;
    }

    acc[frequency] = translationsForFrequency.slice(0, maxPerFrequency[frequency]);

    return acc;
  }, [] as TranslationsByFrequency);

  return limitedTranslationsByFrequency;
}
